---
layout: post
title: "Ecto Embedded Schemas in Action"
date: 2019-10-13T11:52:00-04:00
comments: true
categories: ["ecto", "embedded schemas", "json"]
---

I mentioned in my [last post](/blog/2019-10-12-design-pattern-fun/) the benefits of a nice design pattern, and in this post, I'll expand on that same Enrollment Unification / Admissions Portal project but focus on another aspect of the implementation that I found interesting: the use of Ecto Embedded Schemas.

## What are Ecto Embedded Schemas?
Embedded schemas in Ecto are a way of embedding data structures on the same record of a parent schema. They are often used as an alternative to associations on another table, with a foreign key and join, which has a number of benefits, including reduced database queries for commonly retrieved associated records. Another benefit of embedded schemas is that if the fields of the data change very often, you don't need to make a lot of table migrations. You'd just need to make a code change.

## The Use Case

In the Enrollment Unification project I worked on, I think I found a good use case for embedded schemas.

Here's the scenario.

I work at a school that offers career-changing courses in the form of bootcamps. The pricing for our course offerings varies, as you might expect, by the course, the market, and the method by which you pay, which can be one of the following: upfront, loan, or income share agreement.

The pricing also tends to change frequently enough that it's unwise to hardcode it. Furthermore, when we do change prices, we have to be careful to honor the pricing promised to students who enroll by a certain date. They are essentially grandfathered in to the previous pricing. With this in mind, anticipating change as well as the ability to create custom pricing for each student that is locked at a certain point in time, I decided to try using embedded schemas. 

Prices, as I mentioned, tend to change. And since I didn't think it was a good idea to a) hardcode the prices or b) create tables to hold onto prices that can change or build an interface for our finance team to update prices, I decided to store the prices in a table on Salesforce. This is where the business side of the office tends to spend most of their time, and it is configurable relatively quickly, as opposed to building something myself with code. I think this works for now, but in the long term, we will need to re-evaluate.

## The Workflow
So, this is the proposed workflow to the admissions process.

- When a student is admitted, we query Salesforce for the pricing objects available for the student's market and course.
- From the results of that query, we transform, sanitize, and save "price quotes" that are stored on the student's payment plan record.
- When the student goes to select their payment option, we read those price quotes and merge them with the payment options available to them, which depend on their location and the campus they plan to attend.

## The Code

Here are the steps and code changes needed to make this happen.


1. Create a migration to add a jsonb column, which will store the data for the schemas.

```elixir
defmodule Registrar.Repo.Migrations.AddPriceQuoteToPaymentPlans do
  use Ecto.Migration

  def change do
    alter table(:payment_plans) do
      add :price_quotes, {:array, :jsonb}, default: []
    end
  end
end

```
We are using a Postgres database, not MySQL, by the way, so adding an array column is pretty straightforward. Also, we are using an array column since the association is one-to-many between the payment plan and the price quotes. If it were one to one, we could use a column type of `:jsonb` instead.

2. Add the embedded schema in code

```elixir
defmodule Registrar.Billing.PaymentPlan do
  @moduledoc """
  PaymentPlan schema and related functions
  """

  schema "payment_plans" do
    embeds_many(:price_quotes, PriceQuote, on_replace: :delete)
    timestamps()
  end

  def set_price_quotes_changeset(payment_plan, price_quotes \\ [], attrs \\ %{}) do
    payment_plan
    |> put_embed(:price_quotes, price_quotes)
  end
end
```
To the `PaymentPlan` schema, we add the `embeds_many` association and specify the struct to which that data should be mapped when queried. We also add a changeset specific to setting the price quotes. We use `put_embed` here because we will have already handled explicitly transforming the data before it gets here, so we trust it as internal data.

Next, we create the `PriceQuote` module, schema, and changeset.

```elixir
defmodule Registrar.Billing.PriceQuote do
  @moduledoc """
  PriceQuote schema and related functions
  """

  import Ecto.Changeset
  use Ecto.Schema

  alias Registrar.CurrencyHelper

  embedded_schema do
    field(:payment_type_name, :string)
    field(:deposit_amount, :integer)
    field(:gross_tuition_amount, :integer)
    field(:currency, :string)
  end

  def changeset(price_quote, attrs \\ %{}) do
    price_quote
    |> cast(attrs, [
      :payment_type_name,
      :deposit_amount,
      :gross_tuition_amount,
      :currency
    ])
  end
end
```

You'll notice that we use `embedded_schema` rather than `schema` here.

Now the association is set up. When we query for the `payment_plan` belonging to the student, the `price_quotes` will already be loaded and we won't have to explicitly preload them.

## Embedded Schemas in Practice

In practice, we have a function that gets called as part of a student's admittance. This is in the `Billing` module.

```elixir

@doc """
Configures a student's tuition package by creating a payment plan with pricing

Parameters:
* `attrs`: Struct with cohort and admittee_id
"""
def create_tuition_package_for_admission(
      %{
        cohort: %{course: %{name: course_name}, campus: %{market: %{name: market_name}},
        admittee_id: admittee_id
      } = admission
    ) do
  with {:ok, payment_plan} <-
         find_or_create_payment_plan(%{
           customer_uuid: admittee_id
         }),
       {:ok, salesforce_prices} <-
         @salesforce_client.get_prices_for(%{market_name: market_name, course_name: course_name}) do
    set_price_quotes(payment_plan, %{
      salesforce_prices: salesforce_prices
    })
  else
    {:error, message} = error ->
      error_response = %Error{error: error, message: message}

      error_response
      |> @error_handler.notify_error(params: admission)

      {:error, error_response}
  end
end
```

In words, we accept an `admission` record as an argument, and pull out the names of the associated market and course. We then find or create a payment plan record and then go on to query Salesforce for the prices. The Salesforce Client in our codebase will handle the necessary transformations. We then take that data and pass it along to a function that will persist the `price_quotes` on the `payment_plan` itself.

Now, this information will be retrieved later on when the student wants to access their payment options. It gets a little more complicated when we take any scholarship info into account, so we end up doing a lot of calculations to present the correct numbers to the student.

The code gets a bit convoluted out of context (lots of chained function calls), but here is a function that illustrates the crux of the logic.

```elixir

@doc """
Returns a PaymentType struct with financial quote for student's admission

Parameters:
* `payment_type`: PaymentType struct
* `payment_plan`: PaymentPlan struct
"""
def generate_payment_quote_for(payment_type, %{
      currency: currency,
      scholarship_amount: scholarship_amount,
      scholarship_name: scholarship_name,
      price_quotes: price_quotes
    }) do
  case calculate_pricing_from_price_quote_and_payment_type(
         price_quotes,
         payment_type.name,
         scholarship_amount
       ) do
    %{
      deposit_amount: deposit_amount,
      balance_amount_before_scholarship: balance_amount_before_scholarship,
      balance_amount: balance_amount
    } ->
      %{
        payment_type
        | deposit_amount: deposit_amount,
          balance_amount: balance_amount,
          balance_amount_before_scholarship: balance_amount_before_scholarship,
          currency: currency,
          scholarship_name: scholarship_name
      }

    _ ->
      nil
  end
end
```

Okay, so what's happening here? Well, we pass in a given `payment_type` name and then retrieve the corresponding price quote for that payment type. We perform some calculations to figure out the balances owed less scholarships, and then take all that information and stuff it into a struct that gets passed to the view.

Is it exciting and elegant? I think so.


## Benefits

Some of the key benefits of using embedded schemas for this use case are:
- The pricing is locked at a point in time, and if it changes, we can do a full replace on a single payment plan's field.
- The pricing is external to our app and is pretty easily changed by others (The disadvantage here is that we need to be extra defensive in how we handle errors).
- We did not need to make another table to store this information or run too many additional migrations as we developed on this feature.
- It is a pretty lightweight way to plan to store data that might have to change a lot.
- The pricing quote data IS still structured but flexible, so each entry shares a common shape.

So, all in all, we'll see whether these embedded schemas stand the test of time, but so far it's been working out pretty well.

## Resources
- [Programming Ecto](https://pragprog.com/book/wmecto/programming-ecto)
- [Ecto.Schema Docs](https://hexdocs.pm/ecto/Ecto.Schema.html)

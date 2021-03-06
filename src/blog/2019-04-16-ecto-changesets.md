---
layout: post
title: "How to Use Ecto.Changeset"
date: 2019-04-16T09:57:16-05:00
comments: true
categories: ["elixir", "ecto"]
---

_or, be the changeset you want to see in the world_

This post explains how `Ecto.Changeset` can help you make safer changes to
your data by providing a foundation for thinking more strategically about
providing multiple update policies.

## A troublesome update scenario

Imagine you're building an application that does a lot of complex things. I
mean, what application doesn't these days, but let's for instance say you're
building an application that deals with lots of complex business workflows.

Like creating invoices and sending them out.

Maybe there are different types
of invoices: invoices for deposits and invoices for tuition installment
payments. You can create invoices and schedule them. You can cancel them.
You can edit their due dates. But what if you try to change the due date
and accidentally cancel the invoice while you're trying to update the invoice
record?

Whoops. Disaster.

This scenario might sound contrived, but it's easier to make this mistake
than you might expect because _not every change to a database record follows
the same rules. We need separate policies for different types of
updates._

I've been working with Rails for the past three years and only recently
hopped on the Elixir / Phoenix bandwagon, so let's think about how we might
implement in the Rails framework.

### Building Invoicing in Rails

In Rails, aided by ActiveRecord, you'd most likely create an `Invoice` model that maps precisely to
an `invoices` table. You generate a migration and running that migration
automatically updates the schema, so you know what tables and columns exist
at any time.


```ruby
# db/schema.rb
create_table "invoices", force: :cascade do |t|
  t.datetime   "closed_at"
  t.datetime   "due_date"
  t.datetime   "paid_at"
  t.datetime   "scheduled_send_date"
  t.datetime   "sent_at"
  t.integer    "amount_due"
  t.string     "invoice_type"
end
```

In Rails, the convention is to write validations on the model. All invoices
require an amount due, a due date, and a scheduled send date. Invoices can
exist in a state where they're scheduled, but not sent, and sent but
unpaid. If you wanted, you could also add conditional validations in the
model, like an invoice can only be closed if it's unpaid.


```ruby
class Invoice < ActiveRecord::Base
  validates_presence_of :amount_due, :due_date, :scheduled_send_date
  validate :closeable_if_unpaid

  def closeable_if_unpaid
    if paid_at.present? && closed_at.present?
      errors.add(:closed_at, "cannot be closed")
    end
  end
end
```

That's all fine. You build out the web app so that users can perform basic
CRUD actions on invoices. (I'm glossing over a lot of Rails conventions here,
but hopefully that's OK since this is just for demonstrative purposes.)

```ruby
class InvoicesController < ApplicationController
  def edit
    @invoice = Invoice.find(params[:id])
  end

  def update
    invoice = Invoice.find(params[:id])
    invoice.update!(invoice_params)

    redirect_to invoice
  end

  private

  # You even add strong params! These are the only params allowed in the
  # mass assignment update. But it's a little weird because this is in the
  # controller...and if invoices are updated anywhere else, you could stuff
  # more or less params in the update.

  def invoice_params
    params.require(:invoice).permit(:amount_due, :closed_at, :due_date,
    :scheduled_send_date, :paid_at)
  end
end
```

Now, let's assume the invoice is created and the invoicer wants to edit the
invoice. The invoicer goes to the Invoice#edit form and sees a bunch of
fields. She makes her changes, clicks submit, and boom. The invoice is
updated.

A few beats later, another developer wants to implement closing an invoice.
Since closing an invoice is modifying an existing record, the developer
thinks to reuse the existing `update` action in the controller and throws a
field denoting a cancel on the form.

```ruby
class InvoicesController < ApplicationController
  def update

    # The developer reasons that adding a timestamp to the params to
    # leverage the existing code will do the trick

    if params[:cancel]
      invoice_params[:closed_at] = Time.current
    end

    invoice = Invoice.find(params[:id])
    invoice.update!(invoice_params) # what's in these params?!?

    redirect_to invoice
  end

  private

  def invoice_params
    params.require(:invoice).permit(:amount_due, :closed_at, :due_date,
    :scheduled_send_date, :paid_at)
  end
end
```

But what's in those `invoice_params`?!

 It could be anything. Even a
`closed_at` timestamp. The next thing you know, the invoice is mysteriously closed and someone has to go
figure out why.

You could also do even more damage from a Rails console
update, but that's a whole other thing.

```ruby
# Look, I can close a paid invoice
=> invoice = Invoice.find(1)
=> #<Invoice id: 1, amount_due: 10000, due_date: "2019-04-30 11:18:22", scheduled_send_date: "2019-04-24 18:29:47", closed_at: nil>
=> invoice.update(closed_at: Time.current)
=> #<Invoice id: 1, amount_due: 10000, due_date: "2019-04-30 11:18:22", scheduled_send_date: "2019-04-24 18:29:47", closed_at: "2019-04-17 13:09:12">
```

All it takes is a few lines of code to create a lot of surface area for
weird bugs.


This is where the beauty of `Ecto.Changeset` comes in. It's a module with a
set of functions that helps you reason about the ways in which you're
changing your data and more explicitly manage strategies for changes.

## Why Ecto.Changeset?

First, a couple points of clarification:
- `Ecto` is a database library or "persistence framework" for Elixir. It's not the only one, but it's a
  nice one.
- `Ecto` is two separate packages: `ecto` and `ecto_sql` so you can get the
  data manipulation features without using a relational database.
- You can use `Ecto` without Phoenix if you're building a basic Elixir app. However, it works really nicely with
  Phoenix, so hooray.

And now, onto the `Ecto.Changeset`, which is one module that's part of the
`Ecto` library. What's a changeset? Well, it's a data structure with some
helper functions that helps you manipulate, cast, filter, validate, and
otherwise transform your data into the format you expect.

Let's think about building out the same invoicing functionality in an Elixir
application.

### Building Invoicing in Elixir

In Elixir, using `Ecto.Changeset`, you could make a changeset for every
update strategy you need.

For creating an invoice, you could create a changeset that looks like this:

```elixir
defmodule Registrar.Billing.Invoice do
  # assume that we have an Ecto.Schema defined with all the fields this module needs to know about
  import Ecto.Changeset

	def changeset(%Invoice{} = invoice, attrs \\ %{}) do
    invoice
    |> cast(attrs, [
      :amount_due,
      :due_date,
      :scheduled_send_date
      ])
    |> validate_required([
      :amount_due,
      :due_date,
      :scheduled_send_date
    ])
    |> validate_due_date_not_past()
	end
end
```

In this changeset, only three fields are allowed to be updated. So even though the `paid_at`
and `closed_at` columns exist in the `invoices` table, you cannot update
them with this default changeset because it wouldn't make sense to create an
invoice and close it or mark it as paid at the same time. If those
attributes are passed to this changeset, the changes are filtered out and
discarded.

```elixir
iex> attributes = %{amount_due: 3000, due_date: "2019-04-30", scheduled_send_date: "2019-04-25",
iex> closed_at: "2019-05-01"}
iex> changeset = Registrar.Billing.Invoice.changeset(%Invoice{}, attributes)
iex> #Ecto.Changeset<
  action: nil,
  changes: %{amount_due: 3000, due_date: ~D[2019-04-30], scheduled_send_date: ~D[2019-04-25]},
  errors: [],
  data: #Registrar.Billing.Invoice<>,
  valid?: true
>
iex> changeset.changes
iex> %{amount_due: 3000, due_date: ~D[2019-04-30], scheduled_send_date: ~D[2019-04-25]}
```

The extra attribute `closed_at` disappears and is not included in the set of changes. So no
matter how hard you try to close an invoice when you create it, you can't.
Because of the rules defined as part of this changeset.


What would be cooler is if we defined changesets to handle each of those
kinds of updates as well.

```elixir
defmodule Registrar.Billing.Invoice do
  import Ecto.Changeset

	def mark_paid_changeset(%Invoice{} = invoice, attrs \\ %{}) do
    invoice
    |> cast(attrs, [
      :paid_at
      ])
    |> validate_required([
      :paid_at
    ])
	end
end
```
What's nice here is that we can skip the validation for checking if the due
date is past, because that no longer applies in this scenario. If the due
date is past, that doesn't mean the record is in valid. It just means that
the payment is overdue.

Now, let's think about closing an invoice. It doesn't make sense to close an
invoice if it's already been paid. So we can write a custom validation to
enforce this rule.


```elixir
defmodule Registrar.Billing.Invoice do
  import Ecto.Changeset

	def mark_closed_changeset(%Invoice{} = invoice, attrs \\ %{}) do
    invoice
    |> cast(attrs, [
      :closed_at
      ])
    |> validate_required([
      :closed_at
    ])
    |> validate_not_paid()
	end
end
```

The entire act of creating or updating a record is encapsulated nicely
within the changeset. Validations are explicitly applied in specific
situations. Attributes are cast and filtered all as part of the same
pipeline, instead of splitting the responsibility between a model and a
controller. Thanks to `Ecto.Changeset`, we have a saner way of thinking about
updates to our records.

## Cool, and what else can changesets do?
Let's go into a little more detail about what exactly is going on in a
changeset.

As I mentioned earlier, changesets are powerful and they can do a lot of
work to help you manipulate your data. Like many things in Elixir, we can
think about changesets in terms of pipelines.

```
struct_or_map_of_data
  |> cast_allowable_fields_to_their_types_as_defined_in_ecto_schema(params, [:whitelisted_field, :whitelisted_field])
  |> validate_format_presence_and_everything_else_you_need()
  |> handle_constraints(:field)
```

Back to our original example. We have a set of parameters that are sent from
a form and not generated by the application itself, so we are leveraging the `cast` function from `Ecto`.
(If you were manipulating data generated by the application, you could use the `change` function instead, which skips casting to the correct data type.)

Next, we validate that the attributes required for this change are present.

And finally, we add some custom validations to ensure that we're not trying
to create an invoice for the past.

```elixir
defmodule Registrar.Billing.Invoice do
  import Ecto.Changeset

	def changeset(%Invoice{} = invoice, attrs \\ %{}) do
    invoice
    |> cast(attrs, [
      :amount_due,
      :due_date,
      :scheduled_send_date
      ])
    |> validate_required([
      :amount_due,
      :due_date,
      :scheduled_send_date
    ])
    |> validate_due_date_not_past()
	end


  # Custom validation here, which accepts a changeset, adds a custom error when applicable,
  # and returns the changeset
  defp validate_due_date_not_past(changeset) do
		validate_change(changeset, :due_date, fn _, due_date ->
      now = NaiveDateTime.utc_now()

      case NaiveDateTime.compare(due_date, now) do
        :lt -> [due_date: "cannot be in past"]
        _ -> []
      end
    end)
  end
end
```

With all of these changesets, the final thing you need to do to commit the change is get the `Repo` involved.

Inserting or updating the record like this would do the trick:
```elixir
Repo.insert(changeset)
Repo.update(changeset)
```

Or, better yet, define a context with a function to encapsulate the changes.

```elixir
defmodule Registrar.Billing do
	def create_invoice(attributes) do
		%Invoice{}
		|> Registrar.Billing.Invoice.changeset(attributes)
		|> Repo.insert!()
	end
end
```

If you wanted to look at the set of changes, you could get a reference to the changeset and call `.changes` on it, which would list out all the changes about to be made. Also, if you wanted to check validity, simply call `.valid?` on the changeset. And `.errors` will give you a list of any errors.

## What about constraints, though?
Great question.

So, all of the validations will get run before the database
even gets involved, and if any validations failed, constraints will not be
checked. Constraints will halt execution at the first failed
constraint and they depend on the database.

Constraints are typically used in conjunction with database indexes.

For example, you might use a constraint to check for uniqueness, or to
confirm that a foreign key exists in another table.

To check uniqueness, you would add a `unique_index` to your table and then
define a constraint as part of a changeset.

In the example of `invoices`, let's say that an invoice must have a unique
email address.

```elixir
defmodule Registrar.Repo.Migrations.ChangeInvoicesTable do
  use Ecto.Migration

  def change do
    create unique_index(:invoices, :email)
  end
end
```

Then, we define a constraint in the changeset to gracefully handle the error thrown by the
database constraint. This will convert the database constraint violation
into a friendlier error handled by the changeset and returned.

```elixir
defmodule Registrar.Billing.Invoice do
  import Ecto.Changeset

	def changeset(%Invoice{} = invoice, attrs \\ %{}) do
    invoice
    |> cast(attrs, [
      :amount_due,
      :due_date,
      :scheduled_send_date,
      :email
      ])
    |> validate_required([
      :amount_due,
      :due_date,
      :scheduled_send_date,
      :email
    ])
    |> validate_due_date_not_past()
    |> unique_constraint(:email)
	end
end
```

If the email "tracy@example.com" was already associated with an invoice and
we tried to insert a new record, we'd get a changeset error like the
following:


```elixir
{:error,
 #Ecto.Changeset<
   action: :insert,
   changes: %{
     email: "tracy@example.com"
   },
   errors: [
     email: {"has already been taken",
      [
        constraint: :unique,
        constraint_name: "email_index"
      ]}
   ],
   data: #Registrar.Billing.Invoice<>,
   valid?: false
 >}
```

So constraints delegate to the database. This is especially useful when dealing with potential race conditions.
For example, if you were checking uniqueness in a model or in the code, it's possible that a record is inserted into the database while you're doing the uniqueness check.
By delegating to the database, we're certain that no duplicates slip in.

## But can I make changes to my data without changesets?

I mean...yes, but why would you?

```elixir
Repo.insert_all("invoices", [[amount_due: "10_000"]])
```
You could insert a collection of invoices into the database without any validations here, without any schema or changeset.

## And can I use changesets without a schema?

Also, yes! The database doesn't get involved until you access `Repo`, so you
can use changesets for casting and filtering as long as you create a map that does define all field names allowed and their data types.


So that's a lot about the `Ecto.Changeset` module. I use it a lot over at the Flatiron School, where I do work on an app that sends out invoices, and it's been really awesome and useful. But there's plenty more. So if you're also interested in learning more about changesets, definitely check out the following resources.

## Resources
- [Ecto.Changeset
  Documentation](https://hexdocs.pm/ecto/Ecto.Changeset.html)
- [Programming Ecto](https://pragprog.com/book/wmecto/programming-ecto)
- [Programming
  Phoenix](https://pragprog.com/book/phoenix14/programming-phoenix-1-4)



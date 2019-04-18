---
layout: post
title: "How to Use Ecto Changesets"
date: 2019-04-16T09:57:16-05:00
comments: true
categories: ["elixir", "ecto"]
---

_or, be the changeset you want to see in the world_

This post explains how `Ecto.Changeset` can help you make safer changes to
your data by providing a foundation for thinking more strategically about
multiple update policies.

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

But what's in those `invoice_params`? It could be anything. Perhaps an
unsuspecting developer shoved a hidden field into the form and now,
suddenly, there's a `closed_at` param getting sent up through the controller
action. The next thing you know, the invoice is mysteriously closed and someone has to go
figure out why.

You could also do even more damage from a Rails console
update, but that's a whole other thing.

```ruby
# Look, I can close a paid invoice willy-nilly!
> invoice = Invoice.find(1)
> ### insert ex
> invoice.update(closed_at: Time.current)
```

Maybe this is a little contrived, but I think we can all see how a mistake
like this is possible.

This is where the beauty of `Ecto.Changeset` comes in.

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
# insert example
```


What would be cooler is if we defined changesets to handle each of those
kinds of updates as well.

```elixir
defmodule Registrar.Billing.Invoice do
  # assume that we have an Ecto.Schema defined with all the fields this module needs to know about
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
  # assume that we have an Ecto.Schema defined with all the fields this module needs to know about
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
controller. Thanks to Ecto.Changeset, we have a saner way of thinking about
updates to our records.

## Cool, and what else can changesets do?
Let's go into a little more detail about what exactly's going on in a
changeset.

- filter
- cast
- validate

## Resources
- [Ecto.Changeset
  Documentation](https://hexdocs.pm/ecto/Ecto.Changeset.html)
- [Programming Ecto](https://pragprog.com/book/wmecto/programming-ecto)
- [Programming
  Phoenix](https://pragprog.com/book/phoenix14/programming-phoenix-1-4)





---
layout: post
title: "How to Use Ecto Changesets"
date: 2019-04-16T09:57:16-05:00
comments: true
categories: ["elixir", "ecto"]
---

_or, be the changeset you want to see in the world_

This post explains how `Ecto.Changeset` can help you make safer changes to
your data by providing different types of validations per update scenario.

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

In Rails, you'd most likely create an `Invoice` model that maps precisely to
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
  mass assignment update
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

Maybe this is a little contrived, but I think we can all see how a mistake
like this is possible.

This is where the beauty of `Ecto.Changeset` comes in.

## Why `Ecto.Changeset`?

First, a couple points of clarification:
- `Ecto` is a database library for Elixir. It's not the only one, but it's a
  nice one.
- `Ecto` is two separate packages: `ecto` and `ecto_sql` so you can get the
  data manipulation features without using a relational database.
- You can use `Ecto` without Phoenix if you're building a basic Elixir app. However, it works really nicely with
  Phoenix, so hooray.

And now, onto the `Ecto.Changeset`, which is one module that's part of the
`Ecto` library. What's a changeset? Well, it's a data structure with some
helper functions that helps you manipulate, cast, filter, validate, and
otherwise transform your data into the format you expect.









## Great use cases for changesets

## Cool, and what else can changesets do?

## Where can I learn more about changesets?





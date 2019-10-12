---
layout: post
title: "Fun with Design Patterns for an Admissions Portal"
date: 2019-10-12T10:48:00-04:00
comments: true
categories: ["design patterns", "strategy"]
---

## The Enrollment Unification

I recently led and planned a project to migrate our legacy billing system from a Rails monolith to an Elixir "service." It's not really a microservice, but it is a separate app intended to handle the admissions, enrollment, and billing aspects of a student's lifecycle.

Some other things that are moderately interesting before we get into the point of this post, the code.
- We broke the project into distinct phases, first creating an admissions portal for in-person students who don't have an "installments" payment option but are instead required to pay either upfront or with financing. 
- We also launched this feature by campus to gather immediate feedback from reps and students before rolling out the rest of it. This because it does represent a large shift in the way that things are currently done (i.e. totally manually and sometimes out of band)
- The legacy system uses Stripe subscriptions to manage payments. The new system uses Stripe invoices. Our belief was that Stripe subscriptions were making payments more complicated than they had to be. They were used to support a very early phase of our product offering and pricing model, which has since evolved.

Okay, now onto the business complexity and the code to represent it.

## Patterns to Simplify Complexity

So, with billing and admissions there are a lot of rules that vary by location, both the campuses where our schools are located and where the student lives. The Income Share Agreement (ISA), for example, is one particularly gnarly complication. For online students, eligibility depends on where the student lives. For in-person students, the eligibility depends on the campus. So, knowing that, I knew that there were going to be a ton more rules we would probably need to accommodate and that were pretty liable to change. (For some context, I spent a lot of time interviewing stakeholders and trying to make sense of what they were telling me. I would liken a lot of these sessions to "event storming." It was clear for this project that a deep understanding of all the various workflows and which pieces were subject to change was critical.)

Another complication: The deposit amounts required to hold your spot in a particular cohort vary by the payment option you select. For example, in New York, if you pay upfront or obtain a loan through a financing partner, the deposit amount is $1000. If you select an ISA, the deposit amount is instead $2850. There are permutations for every campus, course, and payment option. It's difficult to reason about and even more difficult to get the controlling logic right.

Keeping all that in mind when designing the code implementation, I puzzled over a way to design code that would be flexible enough for change, and came up with what I believe is an implementation of the strategy pattern. 

I should mention that this is a Phoenix app, so...Elixir incoming!

This is what I came up with to represent the various types of payment types: a non-database-backed `PaymentType` struct.

```elixir
defmodule Registrar.Billing.PaymentType do
  @moduledoc """
  Payment Type struct configuration
  """

  @derive {Jason.Encoder, except: [:__meta__, :__struct__, :eligible_to_select]}
  @enforce_keys [
    :name,
    :display_name
  ]

  defstruct ~w[name display_name eligible_to_select deposit_amount balance_amount balance_amount_before_scholarship]a
end

```

The beauty of functional programming is that this is just a struct of data that we can totally pass around. Prior to writing this feature, the `payment_type` selected by the student was represented by a string field on the `PaymentOption` record. Taking an iterative approach, I retained the string and expanded it by turning it into a struct with additional attributes.

Each payment type, for example, has its own struct.


```elixir
def income_share_agreement() do
  %__MODULE__{
    name: "isa",
    display_name: "Income Share Agreement",
    eligible_to_select: &Registrar.Billing.IsaEligibility.eligible_for_admission?/1
  }
end

def loan() do
  %__MODULE__{
    name: "loan",
    display_name: "Finance with a Loan",
    eligible_to_select: &Registrar.Billing.PaymentType.eligible?/1,
    num_payments: 36,
    monthly_installment_amount: 37_500
  }
end

def pay_upfront() do
  %__MODULE__{
    name: "pay_upfront",
    display_name: "Pay Upfront",
    eligible_to_select: &Registrar.Billing.PaymentType.eligible?/1
  }
end

```

Here, we capture the name and provide a display name. We also define an "eligibility" function, which can tell us at runtime which payment types are available to the student. In this manner, we are able to isolate the code that is most likely to change -- the rule sets for calculating eligibility. Each payment type can define how it will behave _differently_ from the other ones.


From here, we can define a few helper functions to make our module behave like a database-backed struct.

## Just Structs, Just Data

```elixir
  @doc """
  Returns a list of all PaymentType structs
  """
  def all() do
    [pay_upfront(), loan(), income_share_agreement(), deferred_payment_plan()]
  end

  @doc """
  Returns a list of financing PaymentType structs
  """
  def financing() do
    [loan(), income_share_agreement(), deferred_payment_plan()]
  end

  @doc """
  Finds a PaymentType struct by name

  Parameters:
  * `payment_type_name`: String name of payment type
  """
  def get_by_name(payment_type_name) do
    case Enum.find(all(), fn payment_type -> payment_type.name == payment_type_name end) do
      nil -> {:error, :not_found}
      payment_type -> {:ok, payment_type}
    end
  end
```

Okay, so now that we've had all these defined, we can get to an even cooler part, calculating which payment types for which the student is eligible. We're going to move into the `Billing` context, which represents the top-level module interface. Other domains, controllers, etc., need to go through top-level modules to call functions on the inside. This helps keep the domains of our codebase isolated.

```elixir

@doc """
Given an admission, returns a list of the payment options for which a student is eligible

Parameters:
* `admission`: Admission struct for student
"""
def payment_option_types_for(admission) do
  Enum.filter(PaymentType.all(), fn payment_type ->
    payment_type.eligible_to_select.(admission)
  end)
end
```

Above, we are actually calling the function defined in `eligible_to_select` with an argument of an `admission` struct. I suppose it could be any struct with certain keys, but I kept it an `admission` record for the time being. Really, perhaps this belongs in a separate context where the `Billing` and `Registration` contexts can interact because that's where we see most of the benefits of automation.

So, that's all for now! I am actually very excited about this code. I really enjoy figuring out the patterns behind things and looking for the right one in code. This one seems to do the trick for now. And have I mentioned I TDD'd it? So it's pretty ready for whatever changes need to happen in the next phase.




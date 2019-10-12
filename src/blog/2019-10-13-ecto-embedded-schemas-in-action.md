---
layout: post
title: "Ecto Embedded Schemas in Action"
date: 2019-10-13T11:52:00-04:00
comments: true
categories: ["ecto", "embedded schemas", "json"]
---

I mentioned in my [last post](/blog/2019-10-12-design-pattern-fun/) the benefits of a nice design pattern, and in this post, I'll expand on that same Enrollment Unification / Admissions Portal project but focus on another aspect of the implementation that I found interesting: the use of Ecto Embedded Schemas.

## What are Ecto Embedded Schemas?

## The Use Case

The pricing for our offerings varies, as you might expect, by the course, the market, and the method by which you pay, which can be on of the following: upfront, loan, or income share agreement. This, in retrospect, makes sense, but at the time I was planning the project, I assumed that the pricing would be constant. After a bit of low-key panicking, I did some research, spiked out a couple solutions and then came up with the following, modified order of operations.

## The Workflow
- need a place to store the pricing variations. 
- decided on hitting Salesforce with an API call
- Transform and persist the pricing information for the admission (cohort, campus, market)
- Read the pricing from the db
- Generate "price quotes" to present to the student for the payment option selection


## The Code
- setting up the embedded schemas
- persisting it
- reading and using the embedded schemas

## Benefits


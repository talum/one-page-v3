---
layout: post
title: "Generating Migrations Checklist"
date: 2019-02-09T19:26:16-05:00
comments: true
categories: ["migrations", "schema"]
---

What tables do we need?
What columns does each table need?
Make sure to add timestamps. You almost can't go wrong with timestamps.
So you think you're storing strings, does uniqueness and case sensitivity
matter? Make it a citext field instead.
Do your records need to communicate with external services? Use a UUID.
What indices do we need? What kinds of lookups will you be performing?
Do you need a database constraint to guarantee uniqueness? Do you need a
compound index?
Enable extensions for citext and UUID.
Null values are not equal for indices. In Rails, however, you need to
provide the allow nil true option when validating presence if you want to be
able to persist null values.
If you're querying by date often, you CAN add an index to a datetime.
If you're removing a table or column, have you removed all the code
references to it first?


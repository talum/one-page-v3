---
layout: post
title: "Enums in ActiveRecord"
date: 2016-05-23T20:29:55-04:00
comments: true
categories: ["ActiveRecord", "Enum"]
---

I stumbled upon something cool in our codebase today while doing some much-needed refactoring on a feature: Enums!

Basically, in any model that inherits from `ActiveRecord::Base`, you can declare an enum to give the record a property that maps to an integer value in the database. That way, you can query records by property name, but store an integer value, which could potentially lead to a cleaner data set and codebase.

Let's say you have a class called `StudentApplication.`

In the model, `student_application.rb`, you could write something like this: 

```ruby
class StudentApplication < ActiveRecord::Base
  enum status: [:accepted, :rejected, :pending]
end
```

By using enums, ActiveRecord will give you some built-in methods that allow you to update a property (in this case, status), check the value of the status, or return the value of that status. So you could do something like this: 
<!-- more -->

```ruby
  student_application.active! # => Sets the status of the application to active. 

  student_application.active? # => Returns a boolean based on whether the status is active

  student_application.status # => returns the value of the status e.g. "active"
```
Pretty cool! And no extra code required. Changing the status in controller actions or other methods is super simple, and you don't have to write more methods to check the boolean. One thing to note though, if you do use an enum, it's important not to change the order of the statuses. The mapping for enums to their integer values is based on the order in which they appear. You should only add values to the end of the array, and if you do decide to remove a value, you should definitely use the explicit hash syntax e.g. `enum: status { accepted: 0, rejected: 1, pending: 2 }`.

You could also query the database for all the StudentApplications that are accepted pretty easily with `StudentApplication.accepted` or with `StudentApplication.where.not(status: :accepted)`. The syntatic sugar is pretty SWEET. (Ha ha ha.)

That's all I've got for now. For further reading, check out the [EdgeAPI](http://edgeapi.rubyonrails.org/classes/ActiveRecord/Enum.html).

---
layout: post
title: "Using ActiveRecord Transactions to Make Actions Atomic"
date: 2016-05-26 21:53:58 -0400
comments: true
categories: ["Active&nbsp;Record", "atomic operations"]
---

I know, I know, I promised to write about some crazy Slim stories (far too long ago, really), but I just learned about this really cool thing called an Active Record Transaction.

In many cases, you need to do a certain set of operations if and only if all of the operations succeed. The common use case, as the [Ruby on Rails API Docs](http://api.rubyonrails.org/classes/ActiveRecord/Transactions/ClassMethods.html) point out, is when transferring an amount of money from one account to another. If one of those operations failed due to a network error or a database breakdown, you could be left with money floating around in the ether. Such an action could be considered "atomic."

ActiveRecord provides something called a "transaction," which is a protective block. Per the [documentation](http://api.rubyonrails.org/classes/ActiveRecord/Transactions/ClassMethods.html), "Transactions are protective blocks where SQL statements are only permanent if they can all succed as one atomic action." If one of the operations in the block failed by raising an exception, a ROLLBACK would be executed and the database would be returned to its previous state. 

In the codebase I work with, this has proven particularly useful in our work with the Stripe API, though there are many more use cases in our app. 

<!-- more -->

Here's a simplified example: 

```ruby
  ActiveRecord::Base.transaction do
    enrollment.create_invoice_item
    enrollment.create_invoice
    enrollment.pay_invoice
    enrollment.update_status
  end
```

In this transaction, we're wrapping up a set of operations in the ActiveRecord::Base.transaction. If, for some reason, the Stripe API were down, and one of these actions raised an exception, the database would be rolled back. On a retry, if these things succeeded, then all of the operations would complete and the database would be updated. Of course, when working with invoicing and monetary transactions, you'd likely need an idempotence id of some sort to ensure that no one was charged multiple times for the same thing (say if creating the invoice item suceeded, but creating the invoice failed).

Another thing to note is that the transaction method can be called on any class that inherits from `ActiveRecord::Base`. That's probably obvious to experienced programmers. However, what's also interesting is that because the transactions are based on per-database connection rather than per-model, objects that are instances of different classes can also be contained within the transaction block, so you could potentially write something like this:

```ruby
  Enrollment.transaction do
    enrollment.update_status
    user.enroll_in_class
  end
```

Active Record Transactions are also the magic behind `save` and `destroy`. Both of these actions only succeed if the validations on the model all succeed. Otherwise, as you've probably seen, a ROLLBACK is performed. 

Anyway, one of the important things to note is that you'd need to bubble up the exceptions to ensure they are actually raised an can trigger the ROLLBACK. Don't let things fail silently! Get all the errors out in the open. You'll thank yourself later.
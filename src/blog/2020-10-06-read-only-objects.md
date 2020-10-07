---
layout: post
title: "Read-only Active Record Objects"
date: 2020-10-06T18:53:00-04:00
comments: true
categories: ["active record"]
---

The other day, I was trying to make an Active Record query for some data and scope that query down by its associated records when I ran into an interesting error! `ActiveRecord::ReadOnlyRecord`.

The real example doesn't make a lot of sense without context, so I'll just make up a similar situation.

Let's say I'm looking for promotions that have associated codes that have been redeemed.

```ruby
	promotions = Promotion.joins(:promotion_codes).where("promotion_codes.redeemed_at is not null")
  => [#<Promotion id: 1, user_id: 1, redemptions_count: 0, max_redemptions_count: 100, begins_at: "2020-10-06 04:00:00", expires_at: nil, name: "My cool promo", code: "PROMO", discount_percent: 10, subscription_duration_months: 1, created_at: "2020-10-06 20:28:32", updated_at: "2020-10-06 20:28:32">]
```
The return value here is an `ActiveRecord::Relation`.

Now, let's say I wanted to go ahead and update each parent promotion record in the collection.

```ruby
	promotions.each do |promotion|
		promotion.expires_at = Time.now
		promotion.save!
	end
```

Executing the above yields...

```ruby
 (0.3ms)  BEGIN
	 #	...stuff stuff stuff
   (0.2ms)  ROLLBACK
ActiveRecord::ReadOnlyRecord: ActiveRecord::ReadOnlyRecord
```
Aha! A ReadOnlyRecord, what?

Turns out that in Rails 3 when you load associated objects with `joins` (or `includes`), the record gets marked as Read Only and the preloaded nested objects are stuffed somewhere in the object seemingly invisible to us.

If we go ahead and selectively select just the attributes pertinent to the `promotions` table, we will once again be able to perform write operations on our objects.

```ruby
	promotions = Promotion.joins(:promotion_codes).where("promotion_codes.redeemed_at is not null").select("promotions.*")
	promotions.each do |promotion|
		promotion.expires_at = Time.now
		promotion.save!
	end
```
Now it works! Hooray.

It looks like this functionality was removed in future versions of [Rails](https://github.com/rails/rails/pull/10769), so don't even get me started about why we're on Rails 3. This was just an interesting thing I stumbled upon in the course of work.

### References
- [Stack Overfolow](https://stackoverflow.com/questions/37576025/why-is-this-a-readonly-record)
- [Rails PR](https://github.com/rails/rails/pull/10769)



---
layout: post
title: "Advanced SQL, the Sequel: Multiple Joins in Active Record Queries"
date: 2015-10-31 21:48:06 -0400
comments: true
categories: "Flatiron&nbsp;School"
---

This past Halloween weekend, the only thing truly scary was how much time I spent alternately staring at my laptop screen blankly, downing chocolate-covered espresso beans, and working on the Flatiron BNB lab.

A few weeks ago, I thought I had an adequate handle on SQL. How wrong I was when I attempted to do the more "advanced" SQL queries using Active Record. 

Active Record, I thought, existed to make my life a billion times easier. But for whatever reason, I found myself (mostly) able to write out the desired SQL statements, but totally unable to translate them into Active Record queries. 

As it turns out, it's because I needed to RTFM. And also calm down.  

##Seriously, Read the Documentation   

[Here it is](http://guides.rubyonrails.org/active_record_querying.html) in all its glory, the Active Record Querying Guide from Rails Guides. Don't be stubborn and stupid like me. Read it all the way through. Okay, it's long. Just be sure you read MOST of it, especially [Section #12 on Joining Tables](http://guides.rubyonrails.org/active_record_querying.html#joining-tables) if you're about to do some serious queries on multiple loosely connected database tables.

##The Models

For the longest time, I stared at my models in a Google Spreadsheet, seeing these tenuous connections. Just as soon as I thought I understood how all the models were connected, I'd forget again and have to retrace my steps. It got to the point where I decided to just draw the thing out on paper. 

<!-- more -->

###Paper

This helped a lot. Ahh...paper. Yes, it still has a purpose in an increasingly digital world. 

![alt text](/images/models.jpg "Flatiron BNB Models")

But still, I couldn't figure out how to get to the reservations table from the city table in order to write some queries for the `highest_ratio_res_to_listings` and `most_res` methods within the City model. 

I wanted to join the cities, neighborhoods, listings, and reservations tables all in one, which sounded to me ridiculous and excessive, and select the reservation counts grouped by city, then order them. And I ended up playing around in the console with stuff that looked like:

###Bad. Don't Do This. 

```ruby
class City < ActiveRecord::Base
  def self.highest_ratio_res_to_listings
    joins(:listings).joins(:reservations)
  end
end
```
Attempting to run this gave me the following error: 

```
ActiveRecord::ConfigurationError: Association named 'reservations' was not found on City; perhaps you misspelled it?
```

No, Active Record, I did not misspell "reservations," thank you very much. I already knew that cities and reservations are only connected through neighborhoods and listings, so there had to be some way to connect the tables. Active Record just wasn't letting me do it the way I would in regular old SQL. 

Then I thought maybe there was a way to write a helper method. Or perhaps I could repurpose the methods I wrote for the Neighborhood class...and sum up the reservation and listing counts for all the neighborhoods belonging to a city, but ultimately I couldn't come up with anything. Everything I tested resulted in a dead end. 

After a few more hours of rageful typing, I found a solution, maybe not the best solution, but a solution: Joining Nested Associations. That's section 12.2.3 and 12.2.4 in the [Active Record Querying Rails Guides](http://guides.rubyonrails.org/active_record_querying.html#joining-tables). 

Apparently, I was doing my joins all wrong. Instead of trying to chain joins together, I should have nested them in this strange-looking hash:

```ruby
joins(neighborhoods: {listings: :reservations})
```

To be honest, I'm still not 100% on this, but it did the trick. If I were to guess, the join syntax must match and reflect the nested relationship among models so that Active Record knows what to join everything on. So, here, cities has_many neighborhoods, which has_many listings, which has_many reservations. And from this massive table, I selected the following counts, grouped them, then ordered them, and returned the first in the list.    


```ruby

  def self.most_res
    select("cities.*, COUNT(*) AS res_count").joins(neighborhoods: {listings: :reservations}).group("neighborhoods.city_id").order("res_count DESC").first
  end

```
And this passed the tested. Whether it's completely right, I'll have to see, and obviously, I'll need to review and practice again, but at least now I know that nested joins are a thing. 

And there you have it. Idiocy and hubris make not a good programmer. 


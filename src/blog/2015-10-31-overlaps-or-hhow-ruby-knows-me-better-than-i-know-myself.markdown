---
layout: post
title: "Overlaps with Ranges and How Ruby Just Gets Me"
date: 2015-10-31T18:55:00-04:00
comments: true
categories: ["Flatiron&nbsp;School"]
---

Until recently, I didn't think that natural languages and computer languages had much in common. Natural languages, or languages for humans, are normally flexible and varied, having evolved organically over time. In natural languages, there are many ways to say the same thing, with different vocabulary or syntax. And unlike in constructued languages (like computer languages), there is ample room for interpretation, so even if you don't speak a perfectly grammatically correct and complete sentence, it's likely that a native speaker will understand what you're trying to say. 

But as I continue learning Ruby, and, more specifically, Ruby on Rails, I'm realizing that learning Ruby is just like learning any other language. It just takes practice and getting used to, but once you're immersed in it, you start thinking in it. Besides, in Ruby, there are many aliases for doing the same thing, which is very similar to having synonyms in natural languages. 

<!--more -->

What's also great about Ruby is that it's very expressive and elegant, and it seems to intuit what you're trying to say (or do). Rails especially continues to freak me out with just how much it anticipates what I want to do, especially with forms. See: `form_for`. You can throw one form in a partial and render it on the **new** and **edit** views? Mind boggling. 

But anyway, here's an example of just how awesome and human-language-like Ruby is. The other day, a classmate (Reuben) and I were working on a super long and difficult lab that mimicked the creation of models similar to that of well-known and popular peer-to-peer room-sharing service. We needed to figure out a way to determine if a listing for a room or property was available over a certain period of time, and we had a few data points at our disposal.

We had all the existing reservations for a listing, with check-in and check-out dates, as well as the desired check-in and check-out date for a new potential reservation. 

First, we tried to use `include?` and `cover?` to see if a listing was available for a date range. 

###Cover Fail: Don't Do This

```ruby
def available?
  ...
  (checkin_requested..checkout_requested).cover?(checkin..checkout)
  ...
end
```

As it turns out, this doesn't work because the logic isn't quite right. The method `cover?` only returns true if a single element is encapsulated in a given range. Passing in a range as an argument won't throw an error, but it also won't return true, even if the entire argument range is covered within the range the method is called on. 

For example:

```ruby
(2..43).cover?(3..5) 
#=> false 

(2..43).cover?(3) 
#=> true
```

###Include Fail: Don't Do This

Up next, we tried `include?`. 

```ruby
def available?
  ...
  (checkin_requested..checkout_requested).include?(checkin..checkout)
  ...
end

```
Again, not great, because `include?` will only return true if a single element in the argument is captured in the range the method is being called on. 

Mostly we encountered the same problem that we had with `cover?`.

```ruby 
(2..43).include?(3..5)
#=> false

(2..43).include?(3)
#=> true
```

(Aside: You can actually use `include_with_range?`, but that isn't the most intuitive thing to type or Google.)

###Overlaps: SUCCESS -- You Can Do This (In Rails)

After those two failed attempts, we started chatting again and wondered if there were some sort of method available that would determine if two ranges overlapped...so we consulted the all-knowing Google and searched for some variation of the phrase "range overlap in Ruby." And short story made shorter, the method is called `overlaps?`. 

Caveat: You can only use it within a Rails environment. If you try to do something similar in irb, you'll get an error.

Example in IRB:
```ruby
(2..43).overlaps?(3..5)
#=> NoMethodError: undefined method 'overlaps?' for 2..43:Range
```  

Example in Rails Console:
```ruby
(2..43).overlaps?(3..5)
#=> true
```

Code Snippet from Our Solution:

```ruby
def available?
  ...
  (checkin_requested..checkout_requested).overlaps?(checkin..checkout)
  ...
end
```

And this got us the information we wanted. `Overlaps?` returns true if two ranges overlap each other. In other words, if the desired check-in and check-out date range overlapped with any of the current reservations, this line would return true, and the listing would be unavailable. For more information on its use, [go here](http://api.rubyonrails.org/classes/Range.html#method-i-overlaps-3F).

Isn't that crazy? It's like Ruby on Rails read my mind...which takes me back to when I was learning Spanish in high school, when I would guess at words instead of looking them up in a dictionary because there are so many English cognates. Surprisingly, I was right a lot of the time. I can only hope I get to that point with Ruby soon.  

So, that's that. I think that when it comes to learning Ruby, the more you learn, the easier it will become to learn more. So for any other beginners out there, stay strong and keep going. At best, you'll be great. At worst, you can always Google. 

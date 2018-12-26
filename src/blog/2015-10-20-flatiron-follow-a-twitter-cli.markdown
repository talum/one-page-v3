---
layout: post
title: "Flatiron Follower, a Twitter CLI"
date: 2015-10-20T14:10:07-04:00
comments: true
categories: "Flatiron&nbsp;School"
---
![alt text](/images/flatironfollower.png "Flatiron Follower")

##The Problem

I'm having a great time at the Flatiron School, so much so that I wanted to connect with all of the friends I've made IRL online. But there are around 34 of us, and searching for everyone individually takes too much time. Friend requests come in waves on Facebook, as another person is slowly discovered by the rest of the class and engulfed into our community, but the process is manual and far too arduous for the lazy programmers we are. Plus it can get awkward. To friend or not to friend? Too soon? Too late? There must be a better way.    

And there is, in a sense. Along with my classmate, Natalie, I decided to write an application that would allow everyone in our class connect with each other, if not on Facebook, then at least on Twitter. For our Flatiron Presents Meetup, we wrote a little CLI application we've entitled [Flatiron Follower](https://github.com/NColey/Flatiron-Student-Follower). 

<!--more--> 

##The Solution

On our first day here, we all created student profiles for a partner and published them to a [class website](https://learn-co-students.github.io/deploy-on-day-1-web-0915/). On each profile, we included information about our partner's biography, and included links to their social media profiles on Github, LinkedIn, and, of course, Twitter. 

Using the [Nokogiri](http://www.nokogiri.org) and [Twitter](https://github.com/sferik/twitter) gems, Natalie and I scraped the students index page and stored each link to a student's profile. Then, we scraped each profile page and stored the Twitter handle information in a hash, which we later used in our application.

```ruby
def student_twitter_hash
  student_page_array.each_with_object({}) do |link, hash|
    profile_html = open(link)
    profile_doc = Nokogiri::HTML(profile_html)
    name = profile_doc.search('.ib_main_header').text
    twitter = profile_doc.search('.social-icons a')[0].attr('href') 
    hash[name] = twitter 
  end
```

After cleansing the data, we created some simple methods that allow a user to enter commands to follow and unfollow everyone (with Twitter) in our class at once. Right now, it works only for us because you need to get some special tokens from the [Twitter developer site](https://apps.twitter.com/) to make it work. But if you're willing and able, you can add your own API keys in an application.yml file to make it work. 

##Challenges

###Data Inconsistency
Unfortunately, we weren't working with perfect data. We're all beginners, but this was especially apparent on day one, when we deployed this website. Whenever we'd try searching through page on a certain CSS selector, we'd find that someone had entered something inconsistently...and then we'd have to clean it up. So a lot of our work was cleaning up the data into a more usable form. In this case, we were working with a relatively small data set, so it wasn't too terrible, but individual exception handling makes this process timely and harder to scale. Ideally, we would like to scrape previous classes' websites as well, but because of the data inconsistencies, this would be rather difficult. 

###Twitter API Errors
Another major concern involved Twitter API errors. As it turns out, you can't follow or unfollow yourself. So to fix this, we created a prompt for a user to enter his/her Twitter handle and wrote a method to remove this handle from the hash. 

Another error we discovered was that after the first follow request to a protected account, you get errors on every subsequent request. We found this out the hard way, after our application kept crashing repeatedly. 

Now, we could do this the hard way and figure out a way to test the relationship between a user and another account, but that was beyond the scope of this project. Instead, we used rescue blocks. So, whenever an error was raised, the program would continue on to the rescue block and spit out an error message to the command line instead of crashing (and burning). Which solved most of our problems for now. 

```ruby
def follow_your_classmates
        begin
            twitter.follow(username_array)
            view = FollowEveryone.new
            view.render
        rescue
            view = FollowEveryoneError.new
            view.render
        end
        
    end
```

##Future Work

Our app is far from perfect, but it's pretty cool for just getting started. In the future, we'd like to improve it by enabling OAuth so that users can authenticate their identity and use the app without getting API tokens and finding more scalable ways to handle errors so that we can scrape the websites of previous classes and follow EVERYONE AT ONCE because after all, we're all in this together.  

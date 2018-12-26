---
layout: post
title: "Building a Rails API for Use with Ember"
date: 2016-01-26 15:12:05 -0500
comments: true
categories: "Flatiron&nbsp;School"
---

While I was a student at the Flatiron School, I was introduced to [Ember](http://emberjs.com/), a front-end framework to simplify and streamline all the clunky, client-side JavaScript you end up using to build highly responsive and fast user experiences. Unfortunately, because we only spent a week on it, it felt like we only dipped our toes in the water, so I decided to tackle an Ember project myself to apply some of the concepts I learned as well as learn some new tricks. Here are the results of that exploration. 

If you know me at all, you'll also know that I'm obsessed with *Downton Abbey*. So for this project, I wanted to build an app to organize some of my favorite quotes from the show, as well as provide synopses of each episode and overviews of each (important) character. You can see my in-progress app hosted right here on [Heroku](http://downton-abbey-quips.herokuapp.com/). It may take a second to boot up because, as I've also learned, making browsers download all that JavaScript up front takes time. 

But first...the back end.

##How to Build a Rails API
For the back end, I built a Rails API. Here's the [code](https://github.com/talum/downton-abbey-guide). On the Rails side, I scraped the Downton Abbey Wikia API and also scraped one of the community site's pages to create interrelated instances of Characters, Episodes, and Seasons. That was an adventure by itself, but it provided me with some good seed data that I could later edit and build upon.  

<!-- more -->

As far as building the API went, I used the [`rails-api` gem](https://github.com/rails-api/rails-api), which has been deprecated but still works. This helps you set up your controllers to inherit from `ActionController::API` rather than  `ActionController::Base`, which means it has fewer built-in methods and is a little lighter. At first, I had namespaced my API under api/v1, but after encountering several issues with trying to incorporate authentication into my app, I decided to un-namespace everything. Through Googling, I found that there are ways to get around this, because Devise was throwing me for a loop, but I haven't gotten around to fixing it yet. All in due time! 

After adding routes for all of my resources, I also defined the standard CRUD actions in the controllers for each resource respectively. And then I moved on to the serializers, which let you decide how to format the JSON data that the Rails API makes available. With an API, you of course render data back instead of a view. 

###Serializers 

All of my serializers inherit from `ActiveModel:Serializer.` And within each serializer, I decided which attributes on each model to make public. 

Only on the Character model did I do any sideloading -- that's when you tell your API to load certain related models alongside the primary data for that specific route. 

For instance, this is what the Character Serializer looks like: 

```ruby
class CharacterSerializer < ActiveModel::Serializer
  embed :ids, include: true
  attributes :id, :name, :title, :social_class, :actor_id, :image_url, :bio
  has_many :quotes
  has_one :actor
  has_one :family

end

``` 
The `has_many` and `has_one` relationships listed here load up the quotes, actor, and family. 

Interestingly, the line `embed :ids, include: true` determines whether, within the models, the related models are also loaded, or if their ids only are loaded. 

For example, when you include `embed :ids, include: true`, the property 'quote_ids':[] appears within the JSON. When you leave it out, you'll get the quotes themselves as JSON. 

Watch out for sideloading data on multiple serializers. It can be easy to create an infinite loop and crash your application. Since I called up the "has_many" relationship here, if I did the same thing from the Actor serializer, I'd end up with a serious problem. In this application, I didn't make use of the Actor model too much, so I'll provide the example of Seasons and Episodes.

In the Episode Serializer, to avoid an infinite loop, I ended up writing an attributes method within the Episode Serializer. This is what the code looks like:

```ruby
class EpisodeSerializer < ActiveModel::Serializer
  attributes :id, :name, :summary, :season_id, :image_url 
  has_many :quotes

  def attributes
    attributes = super 
    attributes[:season] = object.season.try(:as_json)
    attributes
  end
end
```

By using `super`, we can override the superclass attributes method and define how we want it to behave ourselves. In other words, we'll turn the related season into JSON, and not cause season to also load the episode. Cool. That solves that problem. (By the way, props to my instructor Jeff for teaching us this magic.)

###CORS
Oh, by the way, when you're building an API with Rails, you'll need to make the app respond to requests from trusted sources. Various sources suggest that you use the `rack-cors` gem to help. Throw that in your Gemfile, and then within the file `application.rb` you'll need to include this code to enable cross-origin resource sharing. 

```ruby
config.middleware.insert_before 0, "Rack::Cors" do
      allow do
        origins '*'
        resource '*', :headers => :any, :methods => [:get, :post, :options, :put, :patch, :delete]
      end
    end
```

Yes, this enables requests from all sources, not just trusted ones. Yes, that's bad. I had some issues configuring it with Heroku though, so it'll have to do for now. 

Okay, enough of the API side. Now it's time to move over to Ember land in the next post. 
---
layout: post
title: "Setting Up Your Rails App Test Suite with RSpec, Factory Girl, and Faker"
date: 2017-02-12T13:19:02-05:00
comments: true
categories: ["testing", "Rails"]
---

Lately, I've been impressed with the importance of testing when writing an
application. Writing tests forces you to slow down and really think about
the code you want to write. Especially for beginners, it can be easy to
start furiously typing at the keyboard, but that type of development lends
itself to buggy, sloppy code.

Of course, I'm one to talk. When I'm pressed for time and just exploring a
new concept, I tend to just start hacking away with little regard for the
methods or models I need. But now that I've got a year
of professional development under my belt, I think it's time to be more
disciplined about my approach.

Thus, in my most recent side project, an app for tracking ice cream reviews,
I've decided to write some tests! This isn't a purely TDD approach. I got to
a point where it was getting harder for me to make sense of my code, so I
decided to write some tests to cut down on my own confusion.

It's been quite some time since I set up my own suite, so the following is a
guide for how to set up your Rails app's test suite with RSpec, Factory
Girl, and Faker.

# Install and Configure RSpec
RSpec is a testing framework for Ruby, and to integrate it with my Rails
app, I used the `rspec-rails` gem. There are instructions in the
documentation, but I'll paraphrase them here for ease of setting up
everything all at once.

1. Add `rspec-rails` to the `:development` and `:test` groups in your
   Gemfile.
2. From your terminal, run `bundle install`
3. Run `rails generate rspec:install`

This last step will add the following files to your app to configure RSpec:
`.rspec`, `spec/spec_helper.rb`, `spec/rails_helper.rb`

Now, when you want to run the test suite, simply run `bundle exec rspec`
from your terminal. 

There are many types of specs you can write, including model, controller,
mailer, and job. For each of these types of specs, I would place a new
directory within the `spec` directory.

For example, my directory structure for model specs in my ice cream app
would look something like this:

```

-- app
...
-- spec
  -- models
    -- flavor_spec.rb
    -- ice_cream_spec.rb
    -- user_spec.rb

```

To see the exact syntax for writing tests, I would check out the
[documentation on GitHub](https://github.com/rspec/rspec-rails).

Here's an example of a simple test for my `User` model, though.

```ruby

require "rails_helper"

describe User, type: :model do # This line describes what class you're
# testing
  describe "validations" do # Here I'm grouping all of my validations
 # together. 
    context "without an email" do # I'm using the context to specify the
    # exact condition
      it "is invalid without an email" do # This is a basic test block with
      # a description
        user = build(:user, email: nil) # This is where I set up the test
        # user that will be invalid. I'm using Factory Girl to generate the
        # test data and specifying the precise condition under which I expect
        # failure
        expect(user).to be_invalid # This line is just the expectation that
        # will return true or false, pass or fail
      end
    end

    context "when there are duplicate emails" do
      it "is invalid" do
        user = create(:user, email: "test@test.com")
        invalid_user = build(:user, email: "test@test.com")
        expect(invalid_user).to be_invalid
      end
    end

  end
end

```

I'll cover more about Factory Girl next.

# Set Up Factory Girl

Factory Girl is a library that makes it easy to set up test data in Ruby.
Instead of using fixtures, you can use factories to generate dynamic objects
on the fly, and Factory Girl is flexible enough so that you can also build
stubs of objects instead of having to persist an object to the database,
which can considerably slow down your test suite.

(And we all know that if the tests are slow, you're probably less inclined
to write them at all.)

Okay, so one of the gotchas I encountered when trying to install Factory
Girl was that instead of using the generic `factory_girl` gem, I actually
had to use the `factory_girl_rails` gem to use it with Rails.

The steps after that are fairly straightfoward.
1. Add `factory_girl_rails` to your Gemfile

```ruby

group :development, :test do
  gem `factory_girl_rails`
end

```
2. Run `bundle install`
Going forward, Rails should generate factories in the `spec/factories`
directory.

3. Now you'll need to do some configuration.
From the terminal, `touch spec/support/factory_girl.rb`
In this file, write the following:

```ruby

RSpec.configure do |config|
  config.include FactoryGirl::Syntax::Methods
end

```
Now, require this file in the `rails_helper` with `require
'support/factory_girl'`

Remember: Each of your spec files should `require 'rails_helper'`

Setting up factories after the initial setup should be pretty easy, but I'll
leave that until after we incorporate Faker, so we can get some more
interesting test data.

# Set Up Faker
Faker is great because it generates random data for you to use within your
test suite (or, I suppose, within your seed data if you're just doing a demo
app). It's open source, so you should totally contribute with more test
data. Just for fun, they have Harry Potter and Star Wars-themed data...but
in general, you should probably have test data that matches most closely the
data you're expecting in your app.

Setup is easy.

Add the `faker` gem to your `:development` and `:test` groups in your
Gemfile. Then `bundle install`.

You don't need to do much else beyond that besides consult the docs for
which data is available and how to use it.

# Setting Up a Factory with Factory Girl and Faker

By convention, you should write a separate factory for each domain model
in your application. These will go in the `spec/factories` directory.

A basic factory is pretty easy to write.

```ruby

FactoryGirl.define do
  factory :ice_cream, class: IceCream do
    title { Faker::Food.ingredient }    #This is where you define the
    # attributes
    image { Faker::LoremPixel.image  }  # You can write your own default
    # values, or pass a block in the curly braces for dynamic values
    parlor # This is for setting up an associated model
  end
end

```
To use the factory in your test, you would write something like this:

```ruby

ice_cream        = build(:ice_cream)  #not persisted
ice_cream_saved  = create(:ice_cream) #persisted

```

What's more complicated is setting up associated data. As you saw above,
setting up a belongs_to relationship is pretty simple. You just need to make
sure you've defined a factory for the associated model, and then specify the
model's name as an attribute in the factory you're working with.

Above, I was working with the Ice Cream factory, and each ice cream instance
belongs to a parlor. So to set up the association, I simply wrote `parlor`.

Many-to-many relationships are more complex, but not impossible. Among the
many cool things you can do with Factory Girl is nest factories such that
the inner factories will inherit the outer factory's attributes. Below, I've
nested the `ice_cream_with_three_flavors` factory within the generic
`ice_cream` factory so that the `ice_cream_with_three_flavors` factory will
in fact still be valid.

Also important to note is that I've defined a `transient` property that will
be used in the `after(:create)` block. Using this syntax, you can start to
see that you can compose additional factories pretty easily.

```ruby

FactoryGirl.define do
  factory :ice_cream, class: IceCream do
    title { Faker::Food.ingredient }
    image { Faker::LoremPixel.image  }
    parlor

    factory :ice_cream_with_three_flavors, class: IceCream do
      transient do
        flavors_count 3
      end

      after(:create) do |ice_cream, evaluator|
        create_list(:flavor, evaluator.flavors_count, ice_creams: [ice_cream])
      end
      # Ice creams have many flavors and flavors have many ice creams
      # So to get this association to work, I had to pass in the associated
      # model as an array to the `after(:create)` block
    end

    factory :ice_cream_with_two_reviews, class: IceCream do
      transient do
        reviews_count 2
      end

      after(:create) do |ice_cream, evaluator|
        create_list(:review, evaluator.reviews_count, ice_cream: ice_cream)
      end
      # Here, ice creams have many reviews, so it's a one-to-many
      # relationship
      # This means that we can pass a singular ice_cream to each review and
      # set up the association correctly
    end
  end

end

```

# Writing tests

Now let's say I'm writing tests for the associations. Here's how I would use
those factories in a test.

```ruby

require "rails_helper"

describe IceCream, type: :model do
  describe "associations" do
    it "has many flavors" do
      ice_cream_with_flavors = create(:ice_cream_with_three_flavors)
      expect(ice_cream_with_flavors.flavors.count).to eq(3)
    end

    it "has many reviews" do
      ice_cream_with_reviews = create(:ice_cream_with_two_reviews)
      expect(ice_cream_with_reviews.reviews.count).to eq(2)
    end

  end
end
```

And that's it! Hopefully this will inspire you to write tests as well! As
I've been writing code, I've started to see the light: Tests save you from
yourself.

# Resources
- [RSpec](http://rspec.info/) [RSpec Docs](https://github.com/rspec/rspec-rails)
- [RSpec Matchers](https://relishapp.com/rspec/)
- [Factory Girl](https://github.com/thoughtbot/factory_girl/blob/master/GETTING_STARTED.md)
- [Faker](https://github.com/stympy/faker)

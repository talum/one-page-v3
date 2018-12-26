---
layout: post
title: All About Rack
date: 2016-12-28 17:11:59 -0500 
comments: true
categories: 
---

As it turns out, I made it through just about 10 months of professional web
development without really digging into [Rack](https://github.com/rack/rack). That's probably the case for a
lot of web developers who work with abstractions and can tidily forget all about the
middleware that's packaging up a request object for use in our applications.

But since I'm revisiting a lot of the curriculum we covered in my bootcamp,
I thought it'd be a great time to write up a post and do a deeper dive on
Rack.

## What Is Rack?
The need for Rack becomes apparent when we think about the request-response
cycle. The browser, or client, sends a request to a server, which is just
some lines of information including the request method, the request target,
and an optional body. The server parses that information and sends back
information in the form of a response.

## Why Do We Need It?
In the olden days, web servers would parse the request information
differently, so applications would need to factor that into their responses.

Enter Rack, which is middleware that sits between the client and server and
that ensures that web servers parse requests in a particular way, turning
that request into a hash with specific keys. 

For an application to be Rack compliant, you need the following:

* for the application to call `run` on some object
* for that object to respond to a method `call`
* for that `call` method to accept the environment hash as a parameter and return an array with three items: the status code,
  the headers, and a body that responds to the `.each`

Usually that body is nothing more than a string of HTML in an array.

## How Do We Use It?
Using Rack for a simple app is fairly straightforward. 

`gem install rack` or add it to your Gemfile and `bundle install`. Running
`rackup` from your application's root directory will execute the code in
`config.ru`. That's where you'd call the method `run` on some object.

Your call method is what would take in the environment and return different
responses based on the HTTP method and target specified in the
request.

Something even as simple as this in your `config.ru` would work:

```ruby

require 'rack'

class App
  def call(env)
    [200, {}, ['hello world']]
  end
end

run App.new
```

And that's it. Now if you inspect the `env`, you'll see that it's no longer some ugly string, but an beautiful hash you can work with. That's Rack working its magic.

## Resources
* [Learning HTTP](http://www.oreilly.com/openbook/webclient/ch03.html)
* [Rack docs](https://rack.github.io/)

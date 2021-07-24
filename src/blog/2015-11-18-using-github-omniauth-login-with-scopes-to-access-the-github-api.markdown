---
layout: post
title: "Using GitHub OmniAuth Login with Scopes to Access the GitHub API"
date: 2015-11-18T20:53:55-05:00
comments: true
categories: ["Flatiron&nbsp;School"]
---

Using the [OmniAuth gem](https://github.com/intridea/omniauth), it's relatively easy to implement a third-party login for your Rails application. If you read the steps outlined in the documentation and supplement with [this tutorial from Natasha The Robot](http://natashatherobot.com/rails-omniauth-github-tutorial/), you can get set up pretty quickly, which is exactly how I got through the OmniAuth Rails Blog lab in class.  

But there's a catch, which I only discovered recently while working on a soon-to-be-revealed project with my classmate, [Natalie](http://ncoley.github.io/).

##OmniAuth Basics 

The general gist of how OmniAuth login works is that you register your app with one of the affiliated third-party providers and get some secret keys/tokens. Then you load up those tokens in your `config/application.yml` file and create a file called `omniauth.rb` in your initializers directory within your Rails app. 

This is the full contents of my `omniauth.rb` file for enabling GitHub login only, but you can add additional providers:

```ruby
Rails.application.config.middleware.use OmniAuth::Builder do
 provider :github, ENV['GITHUB_KEY'], ENV['GITHUB_SECRET']
end
```
This code acts as middleware to the application. You then set up routes (in config/routes.rb) to redirect users to the appropriate providers (GitHub, Twitter, Facebook, etc.) upon login, and set up an "endpoint," or a place in your application to pick up the information that the provider sends back in a hash through the request. In my lab, I kept it simple with:

```ruby
get '/login', to: redirect('/auth/github')
get '/auth/github/callback' => "sessions#create"
```
Here, you'll see that if the user successfully logs in with GitHub, I can go ahead and pick up the hash that GitHub sends back in the Sessions Controller, more specifically in the create action. (Put a `binding.pry` in your own app to see for yourself.) 

The hash itself comes through the request, and you can access it with `request.env['omniauth.auth']`. Within the hash is a ton of information, most of which you probably will never need. There are paths to images, credentials, follower URLs, and more. 

Because you may want to pass this hash to another part of your application, it's probably a good idea (and a lot of people do this) to write a private method in your Sessions Controller called "auth_hash" to access the hash more directly. Now you don't have to worry about retrieving the omniauth hash from the request every time you need some information about your user. 

<!-- more -->

When doing the lab, all we had to do was create new users in the database that had attributes of provider, UID, and name. On subsequent log ins, users would be directed back to the third-party provider, which would send back a hash upon successful login, and we'd pick up the hash again in the Sessions Controller create action, and then look the user up in the database by the provider and UID attributes. 

That was all well and good for lab purposes, but for this semi-secret project, I wanted to actually use the GitHub API and act on behalf of users...so a crucial piece of what my code was missing is scopes.

##Requesting Scopes from GitHub

Scopes are awesome in that they "let you specify exactly what type of access you need," according to [GitHub's OAuth Documentation](https://developer.github.com/v3/oauth/#scopes). With great power comes great responsibility, so it's important to only ask for as much access as you actually need. By limiting how much access you request, you limit the damage a potential hacker can do should they somehow intercept secret tokens.

By default, if you don't specify a scope for GitHub in `omniauth.rb`, you get read-only access to a user's public information, which was essentially useless to me. I had tried using the access token I received in the hash accessible under `auth_hash["credentials"]["token"]`, to connect to the GitHub API, but I kept getting a 400 error when I tried to write to my profile with a PUT request.  

What I needed was to specify the "user" scope in my file in order to get read/write access to a user's profile. 

There are a bunch of other scopes, including repo, which gives you access to read/write to a user's code and commit statuses, and gist, which gives you write access to these little bits of a user's shareable code within GitHub. GitHub explains the various scopes available nicely [here](https://developer.github.com/v3/oauth/#scopes).

For my purposes, I just needed to tack on the "user" scope. So here is what my code looked like upon making this change.

```ruby
Rails.application.config.middleware.use OmniAuth::Builder do
  provider :github, ENV['GITHUB_KEY'], ENV['GITHUB_SECRET'], scope: "user" 
end
```
And now when I tried logging in through GitHub again, I was prompted to allow the application to access this additional scope. After I did that, I received a different token in the auth_hash, which I saved and was able to use with the GitHub API. 

![alt text](/images/github-modify-auth.png "Modify GitHub Permissions")
A screenshot of fiddling with GitHub scopes.

##GitHub API
To use the GitHub API to modify a user's profile or repositories, you'll need to send along that specific user's access token with your request. Again, GitHub outlines this in their [API guides](https://developer.github.com/v3/oauth/#scopes), but for clarity, here is some more information. 

You can either send the access token through query params or through an Authorization header. At first, I tried the query params method by appending the access token to my request URL.

It looked a little something like this:
```ruby
connection.put("https://api.github.com/user/following/#{username}?access_token=#{auth_token}")
```

Above, I passed in another user's username and my own auth_token, which worked, but since GitHub prefers the "cleaner approach" of the Authorization header, I did some research on how to format such a request using HTTParty. 

The result is something that looks a little like this, assuming you're using HTTParty. I formatted the hash on separate lines just to make it easier on my eyes. For PUT requests, GitHub requires you to pass along a `User-Agent` and set the `Content-Length` to zero. The empty hash that the `body` key points to accomplishes the latter. 

```ruby
 options = {
   headers:{
      "User-Agent" => "Flatiron Follower",
      "Authorization" => "token #{auth_token}"
    },
    body:{}
  } 
  connection.put("https://api.github.com/user/following/#{username}", options)
```

By connecting to the API this way, you can accomplish something along the lines of this...

![alt text](/images/githubfollower.png "My GitHub Page")


And no, for the record, I didn't click follow 50 times. More to come soon. 







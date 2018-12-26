---
layout: post
title: "Document Never Ready? Blame Turbolinks"
date: 2015-12-06T22:31:34-05:00
comments: true
categories: "Flatiron&nbsp;School"
---

A few weeks ago, I was working on adding some JavaScript to a multi-page Rails project when I ran into some issues. Whenever I tried to navigate from one page to another, my JavaScript listener functions wouldn't fire.  

In other words, when I tried to go from the dashboard page to the students index page, nothing would happen when I selected an option from the dropdown menu, which I had hooked up to fire an Ajax requext; however, when I reloaded the page and selected an option, the expected behavior--that a list of students would appear--occurred. 

*Illustrations*
![alt text](/images/flatiron-follower-dashboard.png "Flatiron Follower Dashboard")

![alt text](/images/flatiron-follower-index.png "Flatiron Follower Index")


How weird. Or, in the words of Pamela Fox of Khan Academy, "OH NOES." 

Maybe users wouldn't notice when they were fiddling around with the site, but I found this supremely annoying and decided to get to the root cause. 

And it turns out the culprit is Turbolinks.   

##Turbolinks

Turbolinks. If you're using Rails 4, you've probably seen a mention of Turbolinks somewhere in your project (most likely as a requirement in your `Gemfile`, as a requirement in your `application.js` manifest, and on your `application.html.erb` layout file), because Rails ships with Turbolinks by default. That's fine and dandy, and until you run into a problem you don't need to know much about it. 

But alas, I ran into a problem, so the time has come to learn about Turbolinks. 

##What Is Turbolinks?

Turbolinks is a gem that makes following links to other sites within your web app appear faster by using Ajax to speed up page rendering. In other words, instead of making the browser reload all the HTML, CSS, and JS when you follow a link inside the web application, Turbolinks uses Ajax to only update parts of the page and changes the URL to make it appear as though it's a totally different browser load and parse of the page.

According to [Rails Guides](http://guides.rubyonrails.org/working_with_javascript_in_rails.html#turbolinks), Turbolinks attaches a click handler to all the `<a>` tags on a page, so when someone clicks on a link, Turbolinks makes an Ajax request for the page and updates the document body, or parts of the body. In addition, it also uses PushState to update the URL so that it looks like the route has changed and that the browser has recompiled the HTML, CSS, and JavaScript between page changes. In reality, per the [Turbolinks READ.me](https://github.com/rails/turbolinks/blob/master/README.md), "it keeps the current page instance alive."  

So what does this mean for you? It means that if you write JavaScript that is supposed to fire on document ready on non-landing pages, your JavaScript functions probably won't get called. 

<!-- more -->

Fortunately, as I learned, there's a pretty easy fix. Turbolinks provides a number of events on `document` that you can use as hooks for your JavaScript. Among these are: 

- `page:change` which fires when there's a new document body
- `page:load` which fires when a new document body has been loaded

Much Googling and consulting of guides have led me to believe that hooking into `page:change` is generally preferred. 

For clarity, here's an explicit example from my code. 

```javascript
$(document).on('page:change', function(){
  filterStudentByCohortListener();
});
```
Here, my filterStudentByCohortListener will be triggered when the page changes instead of on `$(document).ready()`. 

With this fix, my code now worked as expected, and we get a little something that looks like this!

![alt text](/images/flatiron-follower-students.png "Flatiron Follower Students")

##Other Solutions

There are, of course, other ways to get around this issue. You could disable Turbolinks altogether and forgo the apparent speed benefits. Alternatively, you could disable Turbolinks on specific links by writing `data-no-turbolinks` within the `<a>` tag. Whatever you decide, definitely check out the resources below. 

##More Resources
- [Turbolinks Railscast from Ryan Bates](http://railscasts.com/episodes/390-turbolinks?autoplay=true)

- [Turbolinks Github Readme](https://github.com/rails/turbolinks/blob/master/README.md)

- [Rails Guides Turbolinks](http://guides.rubyonrails.org/working_with_javascript_in_rails.html#turbolinks)

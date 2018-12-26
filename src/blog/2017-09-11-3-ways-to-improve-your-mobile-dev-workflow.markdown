---
layout: post
title: "3 Ways to Improve Your Mobile Dev Workflow"
date: 2017-09-11T22:49:18-04:00
comments: true
categories: ["mobile"]
---

![Mobile Orientation](https://s3-us-west-2.amazonaws.com/talum.github.io/orientation.gif)

# Mobile First?

I've been hearing people say that we need to design for mobile first for
what feels like years, but depending on your team and whatever product
you're working on, that might not actually happen. 

Such was the case when I started working on a "mobile-optimized" onboarding
flow for [Learn.co](https://learn.co). If you haven't already, you should
totally sign up. On mobile. Because it's SupaFly(tm) right now.

Anyway, having next to no experience implementing a feature for mobile, let
me document some things I learned along the way.

# Momentum Scroll  

One of the first things I noticed when working on mobile was that the scroll
on our site wasn't smooth but "juddery". You'd flick the screen upward and
the page would get stuck. Because we're used to smoother, momentum-style scrolls on our
mobile devices that gradually come to a stop, this felt very unfriendly. I'm
convinced that this turned a lot of our prospective students off, but since
our new flow is going to conflate the data, I don't have solid evidence.

Anyway, as it turns out, this juddery scroll is a) a problem isolated to iOS
devices and b) easily fixible. After a little Googling, I came across [this
article](https://css-tricks.com/snippets/css/momentum-scrolling-on-ios-overflow-elements/) on CSS Tricks. All you have to do is add the property `-webkit-overflow-scrolling: touch;` on the element you'd like to scroll smoother. Although the snippet notes that the scrolling element needs to have the property `overflow-y: scroll` instead of `auto`, I found that not to be the case as of the time of this writing. I kept it auto, and after implementing this property, it was smooth scrolling on my iPhone. Total game-changer.

# Localtunnel

Unfortunately, implementing that new property wasn't as smooth as I would
have liked. As it turns out, you can't put elements with a property of
`position: fixed;` within your scrolling container and expect them to play
nice. At the time, our markup featured a hidden modal within the main site
area that I wanted to make scroll. 

Dumbly, I kept on having to deploy to our QA server in order to test the
site on my iPhone, totally forgetting that there's a helpful tool called
**localtunnel**. 

Now, localtunnel isn't exactly a panacea because you'll probably get some
CSRF issues, but it's good for inspecting the DOM on your mobile device and
being able to more efficiently style some elements.

In the [localtunnel documentation's](https://localtunnel.github.io/www/) words, "Localtunnel allows you to easily
share a web service on your local development machine without messing with
DNS and firewall settings". This means that you can run localtunnel and
funnel web traffic from a funky URL to an app running on a port on your
computer.

The instructions are simple. From the command line, first install
localtunnel globally with:

`npm install -g localtunnel`.

Next, start your local server. If you're running rails, you'd do a little
`rails s` action, which defaults to port 3000.

Next, to start the tunnel, you'd run `lt --port 3000`, using the port your
app is running on. You'll get a crazy looking URL back that you can use to
access your app. Even from your phone, which is what I eventually did.

# Web Inspector on Safari

But the fun doesn't end there. Being able to access the local site from my
phone was one thing, but actually inspecting the DOM was another. In the
past, I've used the Mobile Device Mode in Google Chrome Dev Tools to make my
designs responsive or test how something looks on mobile. 

As it turns out, that isn't quite enough. I ran into a lot of trouble while
embedding a custom quiz from a third party when doing this because the
third-party scripts would often have their own mobile-device detection that
would conditionally render (or not render at all) a responsive quiz.

So to make everyone's lives easier, you should dev for mobile with an
actual mobile device. It sounds silly and obvious, but it's actually kind of
a pain, especially if you don't know about Safari's Web Inspector.

With Safari's Web Inspector, you can plug your iPhone into your Mac and
actually inspect elements on the DOM with highlighting and everything. It's
super cool, and I'm sad I didn't know about it sooner.

There's a tutorial with images [here](https://appletoolbox.com/2014/05/use-web-inspector-debug-mobile-safari/), but in summary, you need to do the following:

1. **Enable settings on your phone**: Under Settings > Safari > Advanced,
toggle Web Inspector
2. **Enable settings on Safari on your Mac**: Launch Safari. Menu >
Preferences > Advanced, check Show Develop menu in menu bar 
3. Plug your phone into the Mac
4. On your phone, navigate to the URL (or the localtunnel URL)
5. On Safari on your Mac, go to Develop in the menu bar. You should see your
phone or iOS device. Hover over the menu item labeled with your device name
and you should see the name of the websites you have open on your phone.
Click on the one you want to check out.

And that's it. Three ways to make mobile better. As a bonus, maybe also
bring up mobile designs earlier in the product design process...and use some
flexbox.


# Resources
- [momentum scroll](https://css-tricks.com/snippets/css/momentum-scrolling-on-ios-overflow-elements/)
- [localtunnel](https://localtunnel.github.io/www/)
- [Google Chrome Dev Tools Device Mode](https://developers.google.com/web/tools/chrome-devtools/device-mode/)
- [Use Web Inspector to Debug Mobile Safari](https://appletoolbox.com/2014/05/use-web-inspector-debug-mobile-safari/)

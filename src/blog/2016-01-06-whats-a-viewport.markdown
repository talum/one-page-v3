---
layout: post
title: "What's a Viewport? "
date: 2016-01-06T12:50:09-05:00
comments: true
categories: ["Flatiron&nbsp;School"]
---

Yesterday, I experienced a big "duh" moment in web design. It's bound to happen when you task yourself with learning how to code in 12 weeks, but this especially was the product of haste and skimming the documentation. 

For all of the web projects I've built so far, I've been using [Bootstrap themes](http://getbootstrap.com/css/#overview-mobile). Bootstrap, of course, is a HTML/CSS/JS framework that makes it easy to build responsive web projects. Although you probably wouldn't use it in production because it's pretty bland and can lead to boring user experiences unless you do some custom work, it gets the job done when you want to build something quickly, say for a beta version or a demo.  

So, when bootstrapping my projects' views, I wrapped all of my elements in rows and columns, expecting them to properly collapse and move around on mobile. Much to my dismay, it didn't work! The full-size website was appearing very scaled down on my mobile device, when I finally got around to testing it. In addition, the navbar elements didn't get hidden, and instead I was left with a very tiny, totally useless navbar. 

So, after further investigation, I discovered I was missing one key element: configuring the viewport. 

##What's a Viewport? 

According to [Google's PageSpeed Insights documentation](https://developers.google.com/speed/docs/insights/ConfigureViewport?hl=en), "A viewport controls how a webpage is displayed on a mobile device. Without a viewport, mobile devices will render the page at a typical screen width, scaled to fit the screen." 

In other words, a viewport is essentially the area of the web page the user sees. On desktop machines, the viewport is huge, and on tablets and mobile phones, it's pretty tiny.

To configure the viewport, all you have to do is include this `<meta>` tag in your page's `<head>`:  

`<meta name="viewport" content="width=device-width, initial-scale=1.0">` 

This tag tells the browser "how to control the page's dimensions and scaling," in the words of [W3Schools](http://www.w3schools.com/css/css_rwd_viewport.asp). 

With this meta tag, you tell the browser to set the set the width of the page equal to the width of the device, and you set the initial zoom level to 1. You could also set the viewport to a fixed width, but in general that's discouraged. Instead, you should make it responsive, by instructing the page to match the screen width. 

After adding that to all my projects, the layouts began being way more attractive and usable on mobile. So that's that. When creating responsive web designs (as you should be doing because more than half of web traffic comes from mobile devices), don't forget to configure the viewport. 

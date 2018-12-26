---
layout: post
title: "The Benefits of Semantic HTML"
date: 2015-12-21T17:55:09-05:00
comments: true
categories: "Flatiron&nbsp;School"
---

Lately I've been researching the pros and cons of writing semantic HTML, and after reading a bunch of articles and taking some time to form my own conclusion, I've decided that it's worth the struggle of mastering it--not for today, but for tomorrow. 

I'll explain. When I first saw a few years ago that the HTML5 standard now included semantic markup such as `<article>` and `<aside>`, I thought to myself, "That's nice, but ulimately useless. Good thing I don't need to learn that right now." That was my naivete talking. Like many people faced with change (TV killed the radio star, VHS will destroy cable), I thought it better to ignore a development until it became mainstream. 

Now, it's basically mainstream, but there is still debate about its practicality. One programmer wrote in [*Smashing Magazine*](http://coding.smashingmagazine.com/2011/11/11/our-pointless-pursuit-of-semantic-value/) that programmers were wasting so much time Googling which tag to use instead of building something of value. And although I can see her point, because there is a time cost associated with learning something new, there are many things that make using semantic markup worthwhile. To ignore them, and any technological development for that matter, is to cling to the past. 

##So What Are Semantic Elements? 

As many references would tell you, semantic elements endow code with additional meaning. So instead of thoughtlessly writing vague `<div>`s all day, you should take a second to think about what collection of data you're presenting to your audience, and wrap that information in the appropriate tag. 

If it's an article, of writing, or clothing, or other type of item, use the `<article>` element. If it's supplemental information, try using the `<aside>` element. Other relatively new elements include the following: 

+ `<details>`
+ `<figure>`
+ `<footer>`
+ `<header>`
+ `<nav>`
+ `<section>`
+ `<summary>`
+ `<time>`

All are further explained with use cases by [W3Schools here](http://www.w3schools.com/html/html5_semantic_elements.asp).

<!-- more -->
##Why Use Them?

But it takes time to figure out which element to use, you protest. Indeed it does, but it will save you time in the long run. 

As we've discussed at the Flatiron School at length, it's important to give your methods and variables the proper name. Doing so cuts down on time spent refactoring and debugging down the line. By **naming things correctly**, you're giving your future self a huge present--the present of not struggling to figure out what you were thinking all those months or years ago. Besides, if someone else takes over a project, they too will know almost instantly what type of data they're dealing with. Win win. The importance of proper naming for future-proofing is, by far, the reason why I'm committing to at least trying to master semantic HTML. 

Another reason to use semantic markup is for **search engines**. As [Vanseo Design](http://vanseodesign.com/web-design/semantic-html/) notes, search engines can use [microformats](http://vanseodesign.com/web-design/microformats-what-how-why/) (agreed-upon classes to convey information) in their rankings. So it's not so much that search engines know what a `<nav>` and `<article>` are right now, but it's always a possibility in the future. 

**Accessibility** is a third reason to use semantic markup. Because there are so many devices and screen readers on the market, how your content is presented may very well depend on the structure of the data. So take a second and pick the right tag, to the best of your ability. In other words, don't pick a tag based on how you think it will look in the browser. Instead, pick the correct structure, and style it accordingly with CSS. 

So that's that, for sure I'll be trying to implement this in all my future coding projects. For more, check out the resources below. 

##Resources
* [HTML5 Doctor](http://html5doctor.com/lets-talk-about-semantics/)
* [HTML Mozilla Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)
* [HTML5 Semantic Elements from W3 Schools](http://www.w3schools.com/html/html5_semantic_elements.asp)
* [Semantic Markup Style Guide](http://webstyleguide.com/wsg3/5-site-structure/2-semantic-markup.html)
* [Do Semantics Matter Anyway?](http://www.smashingmagazine.com/2011/11/html5-semantics/)
* [How Important Is Semantic HTML?](http://vanseodesign.com/web-design/semantic-html/)

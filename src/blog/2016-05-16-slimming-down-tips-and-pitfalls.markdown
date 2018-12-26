---
layout: post
title: "Slimming Down: Tips and Pitfalls"
date: 2016-05-16T20:14:36-04:00
comments: true
categories: ["Flatiron&nbsp;School", "Slim"]
---

There are a bunch of templating languages to choose from out in the wild, but the one we use over at Learn for server-side view renders is [Slim]("http://slim-lang.com/").

According to the Slim docs, it's a template language designed to reduce syntax to its bare minimum without "becoming cryptic." To be honest, it's still sometimes cryptic, but you can usually get the hang of it with enough practice. Even three months into using it, I still (often) need to Google simple things, like insert a link within a block, or create a complex bulleted list, so don't worry if using Slim is difficult at first. Besides, weird things often happen when using Slim, especially when your indentations are slightly off and you have a bunch of modals sitting willy-nilly in your view, but more on that later.

#Basic Stuff You Should Know About Slim

**Indentation is key.**

Slim boasts an elegant, concise syntax. For the most part, you omit `<>` and closing tags and instead use indentation to indicate where a block begins and ends. Slim will usually tell you when something is wrong, but sometimes the errors can be hard to track down. (I have had my fair share of bugs.)

In general, I find that using Slim is nice because it forces you to write well-formed HTML. It does help my team write simple, maintainable, minimalistic templates, but the initial struggle to learn it and get accustomed to its capriciousness is very present. If you can't already tell, I'm pretty split on using Slim. There are days I love it and days I hate it.

This is an example of me using Slim: 

```html
 .container#main-container
   .another-container
     p.formatted Some text, hello!
```
<!-- more -->
As you can see, very simple, stripped-down syntax. You can usually omit `<div>` and just slide class names and id's right into the markup without all those little `<>`s getting in the way. At first glance, you're probably like, "Whoa, what the heck. Where'd all my markup go?" And then you settle down and realize that this is just a pared down version of HTML. It's like poetry compared to prose, dense but potent.

**There are a bunch of ways to do the same thing.**

As with most things, there are many ways to solve the same problem. The same is true with Slim, which can be annoying because it makes you actively weigh all the alternatives, perhaps prompting some analysis paralysis.

Here's an example: You can mix and match some standard html tags with Slim. 

```html
 - if @user
   <strong>Oh hey, just some bold.</strong>
 - else
   <em>More text that I decided to italicize</em>
```

This kind of code works when you're fed up with trying to coerce Slim into cooperating with your intent. When all else fails, I usually resort to mixing up the syntaxes; it doesn't make me feel great, but sometimes it's the only course when you need to meet a deadline.

Another example is that you can usually put text on the same line as a tag *or* you can break out your text on a new line and use a `|` to demarcate the text. Gah! This thing drives me insane. 

```html
 p The new paragraph
```
will produce the same result as 

```html
 p
   | The new paragraph
```

Why are there so many options?! Irritating, but not the end of the world.

**Dashes Versus Equal Signs**

Similar to erb, or [Embedded Ruby]("https://en.wikipedia.org/wiki/ERuby"), there's a difference between using an `=` and not.

You use the `-` to indicate control code, so the `- if` in Slim is equivalent to the `<% if %>` in ERB. You'd also use the `-` character when iterating over a collection. 

Example:
```html
 - users.each do |u|
   #{u.name}
```

Similarly, `=` is nearly equivalent to `<%= %>`, but I more often find myself using string interpolation: `#{@user.name}` to output text. Using `=`, however, is often pretty useful when you want to output the result of a helper method in the template. By using `=` you can keep the output on the same line as the container. For instance:

```html
 h3.heading = due_date(@post)
```
will output some text in the h3 container. 

Alternatively, you could write:

```html
 h3.heading "#{due_date(@post)}"
```

How you decide to write your markup is pretty much totally up to you, since Slim is highly configurable. Here I'm describing the default settings, but there are a number of things (too many things, really) you can do to customize your setup. 

**Whitespace & Verbatim Text**

One thing that confused me a ton at first was the `|` character, which just copies over the line as is. Why would you want to something like this? Good question. It's useful when you want to nest a chunk of text within a container to either retain whitespace, achieve greater code readability, or format text in a very specific way (spans within containers). The times I've used it are very few, and those times I'm mostly certain I could have used a different method (probably string interpolation) to achieve the same effect. Similarly, the `'`, or single quote character, does the same thing, but also adds a single trailing whitespace.       

Oh, by the way, there are still more eways to preserve whitespace. You can add trailing whitespace with the `>` character, or leading whitespace with the `<` character. Or, if you so choose, you can also use *both* together. Confused? Yes, me too. 

Examples from the documentation:
```html
 a> href="url1" Link1 ==> Adds trailing whitespace to link
 a< href="url2" Link2 ==> Adds leading whitespace to link
 a<> href="url3" Link3 ==> Adds both leading and trailing whitespace to link
```

Presumably you can add whitespace to any tag, but I thought seeing those angle brackets inline was one of the most bizarre things Slim could do.

**Delimiters**
For extra confusion (and/or readability), you can also separate html attributes from their tags with either parentheses or brackets, as long as you configure them in the settings: `h1(id="header")`, `h1[id="header"]`, `h1{id="header"}`.


**Ruby Fun Things**
Oh, and here's another fun thing. You can pretty much write a Ruby statement after any equals sign. 

Feeling crazy? Go ahead and write `a href=root_path` or something along those lines. I find that ultra confusing, but hey, if that suits you, do it.

**Splats**
Just today as I was formatting some updated Terms of Service, there was some text with asterisks in it because you know, all legalese uses asterisks. While I was trying to format those statements, my preview blew up. 

Turns out that splat attributes, denoted by asterisks, serve a special function in Slim; they allow you to turn a hash into attributes. Super. So to get around that issue, I used the HTML entity code for asterisks instead, which solved the problem.

And that is just about all I care to write about Slim for the time being. Next up you can expect to hear about some of the crazy bugs I've encountered while writing with Slim.

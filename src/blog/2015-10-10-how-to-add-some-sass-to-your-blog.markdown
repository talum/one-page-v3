---
layout: post
title: "How to Add Some Sass to Your Blog"
date: 2015-10-10 20:08:29 -0400
comments: true
categories: "Flatiron&nbsp;School"
---

##Unleash the Power of Sass
All right, as you might have noticed, my blog looks like a jazzed up version of the classic Octopress theme, and that's because it is! Using the power of Sass, I made some small tweaks to the theme to make it a little more 2015, and a little less 2011. 

By no means do I claim to be an expert on the majesty of Sass, but using these little tips and resources, you could probably spice up your Octopress blogs, and other websites that use fancy frameworks, as well.

##What's Sass? 
Sass stands for [**Syntactically Awesome Stylesheets**](http://sass-lang.com/documentation/file.SASS_REFERENCE.html), and it's basically a stylesheet language, or an extension of CSS, that makes styling your website way easier because its structure mimics that of an HTML document. 

In our Flatiron prework we had to work a lot with CSS selectors and learn when/how to select different elements of a page. Remember that one exercise where we had to clear the graffiti off a wall by finding the nested divs? Ugh, gross. 

Enter Sass. With Sass, you can use features such as nesting, variables, and mixins to make writing CSS fun again, as [Sass-Lang.com](http://sass-lang.com/guide) claims. What you write, in either Sass or its close cousin SCSS, is later processed, and spits out a CSS file you can use in your website's HTML. This is especially useful as your website grows because you could potentially be working with massive CSS files. 

From what I understand, with Octopress, [Rake](https://rubygems.org/gems/rake/versions/10.4.2) handles this processing for us by calling the [Compass gem](http://compass-style.org/) to compile the various files in the sass directory into a CSS file that's already included in the page templates.   

<!--more--> 

##Sassy Syntax and Other Pros 
There are actually [two syntaxes for Sass](http://sass-lang.com/guide), and this part is where it can get a little dicey.

SCSS, or Sassy CSS, is very similar to CSS. SCSS is the newer syntax that most people seem to favor. The classic Octopress theme comes loaded with files ending with the file extension .scss, so I used that syntax. The following screenshots are from [Sass-lang.com](http://sass-lang.com).

SCSS looks a little like this:
![alt text](/images/scss-example.png "SCSS Example")

There's also an indented syntax that's sometimes known just as "Sass." Files written in Sass should have the file extension .sass. Indented syntax, as suggested by its name, uses indents rather than brackets to indicate nesting. 

![alt text](/images/sass-example.png "Sass Example")

With either syntax, after processing, your CSS will look like this. Note how the nested selectors are reformatted. 

![alt text](/images/css-example.png "CSS Example")


**Nesting**
Above is the classic example of nesting that I found particularly useful. Although there are many awesome features of Sass, the other one that's pretty great when you're just getting started is variables.


**Variables**
Let's say you've laid out your color scheme and are essentially reusing the same colors over and over again. Instead of having to remember what each hex color or rgb code stands for, you can use variables to store colors you want to reuse in different parts of your design. You can also do this for fonts. 

Here's an example. The dollar signs denote the variables declared.

![alt text](/images/scss-variables-example.png "SCSS Variables Example")

Which is processed and becomes: 

![alt text](/images/css-variables-output.png "CSS Variables Output")

Boom. Now if you color scheme or fonts change later, you just have to make the change once, and it'll be reflected throughout your site. 


##Where to Add Some Sass in Octopress 
Themes are awesome, but don't you just hate it when your theme looks just like everyone else's? Modifying the sass files in a theme makes it easy for you to add your own custom spin to a theme. 

According to this [resource from another Flatiron friend](http://tsiege.github.io/blog/2014/04/27/tips-on-setting-up-octopress/), all you have to do is open up the sass directory within your octopress project to get started. 

The easiest place to make modifications is in the custom directory. The custom files are compiled last so they override the styling elsewhere in the theme. Apparently, you can write in Sass or SCSS, but I find SCSS, with its brackets, a little easier to read.  


##What I Did Here

![alt text](/images/scss-code.png "My SCSS Code")

I'm pretty lazy/busy, so I just tinkered with a few things in the classic Octopress theme, commenting stuff out and looking for other settings until I was satisfied. Mostly I limited my changes to the custom directory, though I did have to go into the base theme to modify the link hover actions for the post headline.

Also, I used the `rake generate` and `rake preview` command to preview my changes in a browser by navigating it over to *localhost:4000*. When I was all set, I ran `rake generate` and `rake deploy`, and then made my commits and pushed up to GitHub. 

Pretty awesome. Literally.   

##Some Places to Learn More and Experiment with Sass

- [Sassmeister](http://sassmeister.com/): See how Sass and CSS compare
- [Sass Site](http://sass-lang.com/guide): To read the guide
- [Getting Started with Sass and Compass](http://thesassway.com/beginner/getting-started-with-sass-and-compass): Good guide for creating your own projects outside a framework. 

Color palette inspired by Mindy Kaling's new book, *Why Not Me?* btw. I highly recommend it.

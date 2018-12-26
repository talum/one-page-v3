---
layout: post
title: "An Intro to Object-Oriented CSS"
date: 2016-12-26T13:58:14-04:00
comments: true
categories: 
---

After working with an object-oriented CSS framework over on
[Learn.co](https://learn.co), it's almost impossible for me to write CSS any
other way. Thinking about CSS in an object-oriented fashion totally changed
my way of thinkng about styling. Instead of constantly worrying about
conflicting styles and patching them with more specific selectors, I started
seeing ways to encapsulate my styles in reusable objects, and in doing so, I
began to see how CSS could actually be fun and a little therapeutic. 

## Object-Oriented CSS Basics

The real leader of the OOCSS movement is [Nicole
Sullivan](https://github.com/stubbornella/oocss/wiki), who says that the two
main principles of OOCSS are to separate structure and skin and to separate
container and content. To me, this seems like a requirement of any
well-written object-oriented code. In essence, you want loosely coupled code
that is self-documenting. By separating structure from skin and container
from content, we're able to reuse many components of CSS. We can cut down on
repetitive styles, saving ourselves potentially hundreds or thousands of
lines of code. 

There are a few strategies to accomplish this decoupling, including
preferring classes over ids as selectors, using BEM syntax, writing SASS or
SCSS and compiling it to CSS later, and breaking down a design into small
components.

## BEM Syntax

BEM syntax complements OOCSS by breaking styles down into blocks, elements,
and modifiers. 

Blocks are standalone entities on a page -- modules, buttons, banners, etc.
They are the parent-level objects or containers that would form the basis of
your design. 

Elements, meanwhile, are subcomponents of your blocks. They have no
standalone meaning and are tied to their parents. They can also encapsulate
specialized styling. Elements help you break down a block into additional
parts that can be styled differently from the rest of the block. 

Modifiers are flags on blocks or elements. They signify modifications to the
base block or element. Think color changes, or shapes. 

A block would be something like a `.block`. The element would be denoted by
underscores `.block__element`. A modifier would be denoted by two dashes,
`.block--blue` or `block__element--round`.

You can read more about [BEM Syntax here](http://getbem.com/introduction/).

## SASS AND SCSS
Sass also helps you write OOCSS. Personally, I prefer the SCSS variant
because I find the use of curly braces clearer. Whichever syntax you choose,
Sass allows you to use variables, mixins, inheritance, nesting, and partials. You can
make a stylesheet for each of your components and import all of these files
into one manifest. Doing so reduces cognitive overhead and makes your CSS
more modular and maintainable. I found it very useful to store colors in
variables in order to keep the colors used in the design consistent.
Variables are also great for assigning meaning to seemingly arbitrary
numbers. You could compose your framework around a specific pixel number and
then make your object sizes multiples of that number, for example.

Read more about [Sass here](http://sass-lang.com/guide).

## OOCSS in Practice
When writing CSS for my personal website recently, I was amazed to see how
soothing it was to simply focus on one component at a time.

For example, my design used a base `.module` block for a lot of the elements, which I
then extended with variations such as `.module--billboard`,
`.module--callout`, and `.module--card`. Since I made the design myself, I
was mostly just playing around with different variations until something
struck my fancy. Always while constructing, I tried to abstract all the
common styles into the base class and then put different behaviors into the
extensions. 

My base module was defined as this: 

```scss
.module {
  padding: $default-spacing;
  .module__head {
    padding: ($default-spacing / 2) 0;
   }
}
```

And as an example, my `.module--card` looked like this:

```scss
.module--card {
  .module__body {
     @include purple-gradient;
     .image-frame__image {
       @include ease-transition;
       opacity: 1;
          &:hover {
            opacity: 0.5;
          }
     }
   }
  .module__footer {
      background-color: $white;
      position: relative;
      top: ($default-spacing / -2);
      padding: $default-spacing;
      -webkit-box-shadow: 0 10px 6px -6px #777;
      -moz-box-shadow: 0 10px 6px -6px #777;
      box-shadow: 0 10px 6px -6px #777;
  }
}
```

I could probably clean up my modules a bit more, but the idea is that there
is a base module, which I then extend with additional styles. 

The markup on the page would look something like this:

```html
<div class="module module--card">
  <div class="module__body">
    Some body content goes here.
  </div>
  <div class="module__footer">
    Some footer content goes here.
  </div>
</div>
```

And in this manner, but separating skin from structure and content from
container, these styles become portable across my site. You could imagine
that on another page, since there are no references to ids, I could simply
apply the classes `module` and `module--card` to my divs and instantly style
them consistently. It's brilliant!

See the full code [here](https://github.com/talum/one-page).

There are some arguments against writing a whole framework for small sites,
but I think for the most part it's worth it. Just thinking about CSS in this
way makes it more maintainable and extensible. Plus, it makes me feel better
that I'm writing something that I can reuse in the future. It's cleaner and
way more scalable, and yeah, it's just plain awesome. 

Big shoutout to my co-worker [Kate Travers](http://kate-travers.com) for teaching all of us on the Labs team at Flatiron School how to write OOCSS and for enforcing conventions on our framework for Learn.co. She's the best.

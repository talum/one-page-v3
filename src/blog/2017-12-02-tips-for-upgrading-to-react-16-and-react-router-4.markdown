---
layout: post
title: "Tips for Upgrading to React 16 and React Router 4"
date: 2017-12-02T14:09:58-05:00
comments: true
categories: ["react", "react router"]
---

I recently had the pleasure of upgrading a large codebase to React 16 and
React Router 4. Pleasure is perhaps an exaggeration. The upgrade process
went smoother than others I've encountered, but it was pretty painful nonetheless.

Here are a few things I learned along the way that may very well help you
during your upgrade process. 

# Why Upgrade
First, though, why upgrade? You have a feature to ship and upgrading now will just
slow you down, especially if you switch over to React Router 4, whose API
has totally changed!

In general, keeping your libraries up to date will result in less pain later
on because you won't have to deal with upgrading under the gun due to
seemingly sudden deprecations. This recently bit our team when the GitHub
API changed a bit and we hadn't upgraded our Octokit wrapper in years. I
also did the upgrade for that gem and because we did a lot of custom work
with Octokit, it was extremely difficult to decipher what exactly was going
on. That coupled with the lack of good unit and integration tests made it
somewhat of a nightmare for me. Luckily, I did extensive testing and wrote
a bunch of unit tests, so when I finally shipped the upgrade, I didn't break
anything else! Hooray.

So I'm a fan of keeping things as up to date as possible.

Another benefit in particular for React 16 is that it adds a few really nice
features, including the ability to return an array of elements from a render
method, better error handling and boundaries, and a reduced file size. Those
all sound sweet, yeah? Sweet enough to warrant an upgrade.

There are
trade-offs, of course, and you might not want to update all the time, but at
least being aware of changes in your dependencies is pretty important. 

# The Upgrade

Okay, so that brings us to React 16.

So, our codebase is at a point where
we have something of a jungle of JavaScript code. Parts of our app are
written in Backbone and Marionette. Others are straight jQuery. Some use
React and React Router with Alt.js, which is an alternative state mangement library, and the
newest bits use React with Redux. We're currently working on a pretty
massive project that's pretty isolated from the rest of our app. It's pretty
heavy on the JavaScript, and we reasoned that although doing an upgrade
would slow us down, it was a better idea to pay down some technical debt now
because upgrading after this project would be kind of hellish. Usage of
React Router in apps built prior to now was fairly limited, so to tackle
that upgrade would be less painful now rather than later.

I upgraded the entire codebase to React 16 and React Router 4 over the
course of a week. Initially, I did a small spike to see just how hard it
would be to upgrade React, and it turns out it wouldn't be that hard.

Here are the things I had to tackle:
- Replace the deprecated `React.createClass` syntax with the new `class`
  syntax
- Bind all the callbacks in those components
- Replace `react-addons-css-transition-group` with `https://github.com/reactjs/react-transition-group`
- Rewrite components being rendered by a Router component

Rewriting wasn't terrible, but
because we don't have a lot of front-end tests, I had to do a lot of manual
user testing to make sure I didn't take down the whole site. Also, major
props to my former colleague, Seiji, for rewriting a bunch of components to
use the `prop-types` library before he left the team. Major. Kudos.

Fortunately, after I did ship it to production, only a few things broke, and
I was able to resolve them quickly after the fact. 

Anyway, here are the tips for real.

1. Do a small spike before you dive in
2. Write some tests if you don't have adequate coverage
3. Try to chunk the upgrade. For React, I could have rewritten the
   components in smaller chunks rather than shipping one 7,000 line PR. That
   was not wise. I could have done one app at a time since the API didn't
   change a lot.
4. Write some more tests. And do a lot of manual testing.
5. Don't change all your `componentWillMount`s to `componentDidMount`s
   without checking how your different apps are handling a loading state.
   Made that mistake once. Won't do that again. (Some people have talked
   about eventually deprecated that lifecycle hook since it's nearly the
   same as the constructor.)

I think that's all for now. I wish I had written more tests, but yeah, I
know, it's hard. I'm writing this in the hopes that the next time I have to
upgrade something, I heed my own advice.


## Resources
- [React 16](https://reactjs.org/blog/2017/09/26/react-v16.0.html)
- [React 15.5](https://reactjs.org/blog/2017/04/07/react-v15.5.0.html#discontinuing-support-for-react-addons)
- [React Router Training](https://reacttraining.com/react-router/)
- [All About React Router 4](https://css-tricks.com/react-router-4/)

---
layout: post
title: "GatsbyJS Plugins I'm Hyped About"
date: 2018-12-30T12:20:00-05:00
comments: true
categories: ["gatsbyjs"]
---

After I heard practically everyone I know rave about
[GatsbyJS](https://www.gatsbyjs.org/), I decided to give it a try. And you
know what? It did not disappoint.

I wanted to give my personal website a facelift since it's been a few years since I did any major work on it. This time around, I wanted a sleeker design and to also move my personal blog over from GitHub pages so
that all my professional work was in one centralized location.

This post will be a little bit about my process, but will mostly focus on
some Gatsby plugins that helped me a lot.

## Process

So, first, I decided to mock up a design. As it turns out, my design skills
are not great, so I used a tool called [Mockflow](https://mockflow.com) just
to stub out some basic elements and provide some structure for my work. It's
free to start, but they'll charge you if you have more than a few pages to
mock up.

## Codepen

Next, I stubbed out some CSS on Codepen. Mostly I do this because it's a
little easier to fiddle with one single page when I'm also designing at the
same time. [Here is the snippet](https://codepen.io/talum/pen/XoNNVQ). I
still play with it to tweak some things in isolation. I'm really indecisive
when it comes to fonts and colors, so this is helpful for me. Also, I use
[Coolors.co](https://coolors.co/) for color scheme ideas and
[FontPair](https://fontpair.co/) to look at font pairings.
[Fontjoy](https://fontjoy.com/) was also helpful.

## Gatsby
Once I had those two elements in place, I dug into Gatsby. I read through
the docs, which are really well-written, and since I didn't really know what
to do at first glance, I went through the tutorial and used the starter set.
I highly recommend doing the [tutorial](https://www.gatsbyjs.org/tutorial/)
because it was really easy to follow and also informative. It gave me
everything I needed to get started. I made a new repo and started hacking
away at creating components, and adding CSS and JavaScript. Oh, btw, the
major draw of Gatsby is that you get to write React components for your
pages and templates. So if you know React, you're basically all set.

## Migrating from Jekyll to Gatsby
There were a few steps to migrating my blog from Jekyll to Gatsby. Content
wise, I just copied over the blog directory from my Jekyll site's repo to my
new
Gatsby site's repo inside of a new directory called `blog`. Then, I used the [Gatsby
Source Filesystem Plugin](https://www.gatsbyjs.org/tutorial/part-five/) to
make my Markdown files queryable by GraphQL for use in templates. Mostly, I just
followed the tutorial for this part. You'll also need the [Gatsby
Transformer
Remark](https://www.gatsbyjs.org/docs/adding-markdown-pages/#transforming-markdown--gatsby-transformer-remark) to read Markdown content. I did also have to check the datetime
format of my timestamps because the format in my Jekyll blog was not
supported. (This [PR](https://github.com/gatsbyjs/gatsby/pull/4813) was
helpful in identifying the issue.) As the tutorial suggested, I made a new `blog-post.js` template
and modified the `gatsby-node.js` file to create nodes and slugs and use the
`blog-post.js` template.

Once the posts were in place, it was a matter of getting them to render
correctly. A few other plugins were helpful here.

First, since my blog sometimes uses GitHub gists, you'll need the
[`gatsby-remark-embed-gist`](https://www.gatsbyjs.org/packages/gatsby-remark-embed-gist/)
plugin to help you display gists correctly. Without this plugin, gists will
be displayed as code snippets.

Another plugin that was helpful for syntax highlighting was
[`gatsby-remark-prism-js`](https://www.gatsbyjs.org/packages/gatsby-remark-prismjs/?=gatsby-remark).
If you want your syntax highlighting to look real dope, I suggest using
that. Turns out, these two plugins need to be included in this order because
`gatsby-remark-embed-gist` transforms inline code snippets.

The next plugin I suggest is [`gatsby-plugin-google-analytics`](https://www.gatsbyjs.org/packages/gatsby-plugin-google-analytics/?=gatsby-plugin-google) which made is
super easy to include Google Analytics on the page.

And that was about all I needed to get a good MVP of my new site out the
door.

## Deployment
I signed up for [Netlify](https://www.netlify.com/) and set up a deployment
pipeline between my new repo and this service. After some initial hiccups
(because my GitHub account has admin privileges on _way_ too many repos), I
successfully connected my repo through the CLI and was able to start
deploying on merges to my master branch. It was really quite exciting.

## Domain
Once the site was up, I changed the `CNAME` record on a domain I purchased
through Namecheap. (That's a story for another day, but I actually initially
purchased it through another host provider and then ended up initiating a
domain transfer process early last year. Long story short, I now manage my
domains through Namecheap.) That successfully pointed my domain to my new
site.

## Redirects from the GitHub pages site
However, my blog was living over on GitHub pages at
[https://talum.github.io](https://talum.github.io).

To redirect my blog posts, I used a gem called
[jekyll-redirect-from](https://github.com/jekyll/jekyll-redirect-from),
which uses an `HTTP-REFRESH` meta tag to perform a redirect. This is the
boring part: I went through
all my old posts and specified a new redirect URL. And then I pushed my blog
changes up to GitHub.

And now, miraculously, everything is working pretty seamlessly. In a matter
of days, I was able to create and deploy a new static site to Netlify using GatsbyJS,
and it was awesome. I like to think it's a testament to my skill as a
developer, and that is probably true to some extent, but largely it's
a testament to the power of well-designed dev tools.

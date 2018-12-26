---
layout: post
title: "Migrating from Octopress to Jekyll"
date: 2016-11-20 09:58:14 -0400
comments: true
categories: 
---

After a lot of frustration trying to get Octopress to work, I decided to
simplify and switch to Jekyll. So please forgive any missing images and
other weird junk.

## How to Migrate

Fortunately, migrating from Octopress to Jekyll is fairly straightforward. I
went over to the [Jekyll documentation](https://jekyllrb.com/) and installed
the jekyll gem. Then I built a new project with the default theme because
that seemed simplest. 

Next, I updated the URL format to match my current blog in case anyone was
linking to those posts.

In the `_config.yml` file, I added this line:

`permalink: /blog/:year/:month/:day/:title/`

Then, I recursively copied the contents of my old blog, located in the
`source/_posts` directory over to the `_posts` directory in my new project.

After I previewed the blog using `jekyll serve`, I added my old blog's
GitHub repo as a remote to my new blog's directory. Then I force pushed the
updates up, and voila, the blog was migrated.

## Resources

[Adding a Remote](https://help.github.com/articles/adding-a-remote/)

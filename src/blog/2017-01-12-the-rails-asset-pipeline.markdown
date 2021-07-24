---
layout: post
title: "The Rails Asset Pipeline"
date: 2017-01-12T16:06:15-05:00
comments: true
categories: 
---

# What the Asset Pipeline Is & Does
According to the Rails Guides documentation, the asset pipeline is a framework to concatenate and minify or compress your JavaScript and CSS assets for your Rails application. While developing your app, it's likely that you'll have many smaller stylesheets or JavaScript files in order to organize your code. What the asset pipeline enables is combining those files into one master CSS and one master JS file. This cuts down on the number of requests a browser needs to make to load the assets, which means faster loading because the browser can only make so many requests in parallel. 

The asset pipeline also allows you to write your CS and JS assets in preprocessors such as Sass or CoffeeScript. When you generate a new Rails app, the `sass-rails`, `coffee-rails`, and `uglifier` gems are automatically added to your Gemfile. Sprockets, a gem that enables the asset pipeline, will use these gems as part of the asset compression process.

Finally, as part of the asset compilation process, the asset pipeline will also minify the CSS and JS files. For CSS, that means removing whitespace and comments. For JavaScript, there are different configurable processes for minifcation.

# Sprockets
The asset pipeline is implemented by the `sprockets-rails` gem. Assets you use in your application should be placed in either the `app/assets`, `lib/assets`, or `vendor/assets` directories. The difference among the three is that `app/assets` should be reserved for assets owned by the application, `lib/assets` should contain your own libraries' code, and `vendor/assets` is for third-party libraries. 

The Sprockets gem will search the three default asset locations for a referenced file. Within the `app/assets` file is where you should define your manifest file. The manifest file should list which other files Sprockets should use to build the master asset file.  

Sprockets will read the directives, or instructions, in the manifest file to figure out which assets to require. There are multiple directives that Sprockets can parse, including `require`, `require_directory`, `require_tree`, `require_self`, and link. One imporant thing to note is that if you try to require a package with both JS and CSS files, the files for each language will need to be broken out into separate directories so that Sprockets can correctly concatenate them. That should probably have been obvious, but eh, live and learn, right?

## Directives Examples

For `require_directory`, the argument must be a relative path. So if your directory structure looks like this: 

```
app
  --assets
    --stylesheets
      --books
      --application.css
```

the directive from `application.css` would look like this: 

```css
  *= require ./books
```

`require_tree` is different in that it will also recursively require all the
files in subdirectories of the directory specified.

`require` will only require the file name specified by the path. If that
file happens to be an index file (index.css), everything explicitly listed in the
manifest file will also be required.

For example, if your directory structure looks like this:

```
app
  --assets
  --stylesheets
    --books
      --books.css
      --index.css
      --style.css
    --application.css
```

you could do the following:

```
/*application.css*/

  /*
    *= require books
   */
```

Sprockets treats index files as "proxies for folders", so when you specify
to require `books`, Sprockets will find the `index.css` and read that file.

Then, from you could:

```
/* index.css */

  /*
    *= require ./books.css
  */

```

This would tell Sprockets to require the books css file as well. Thus,
within directories, you could have separate manifest files in order to be
very explicit about which files to include in the asset pipeline.


For more information about directives, see the [Sprockets gem documentation](https://github.com/rails/sprockets). Typically, I end up using `require`, `require_tree`, and `require_self`. 

## Using Sass
If you're using sass, you should use the `@import` rule instead of sprockets directives because of scope. Without the `@import`, you won’t be able to use mixins and variables.

In addition, if you're using CSS and SAss with the asset pipeline, you'll
need to use the `image-url`, `image-path`, `asset-url`, and `asset-path`
helpers in oder to correctly reference the images, fonts, and videos from
the stylesheets.

The search path for the asset pipeline will follow the order of app, lib,
then vendor. If a file with the same name is found first, only that file
will be included in the master file.

## Linking to the Stylesheet
Then, to load up the master stylesheet and JS file, you'd use the stylesheet
and JS link tags:

```
  <%= stylesheet_link_tag "application" %>
  <%= javascript_include_tag "application" %>

```

You can include separate stylesheets and JavaScript files at the controller
level, but I'll leave that to the Rails Guides to explain. As always,
there's plenty more to explore, but those are the main takeaways I've
learned recently about the Rails asset pipeline.

# Resources
- [Rails Guides Asset Pipeline](http://guides.rubyonrails.org/asset_pipeline.html)
- [Sprockets](https://github.com/rails/sprockets)

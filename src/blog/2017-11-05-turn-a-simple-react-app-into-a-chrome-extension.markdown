---
layout: post
title: "Turn a Simple React App Into a Chrome Extension"
date: 2017-11-05T09:32:09-05:00
comments: true
categories: ["React", "Chrome"]
---

![Yololo](https://s3-us-west-2.amazonaws.com/talum.github.io/commitsExtension.gif)

When designing my [Commits](https://commits-by-logan.herokuapp.com/) app, I
thought that it would be more useful if I could also access a random commit
message without having to navigate my browser to the website. Let's face it,
people, including myself, are lazy, and it's better to serve up content in
the most accessible way possible. After
seeing many people have a "placeholder" screen when they open a new tab
instead of Google's default, I thought about packing my app up as a Chrome
extension.

As it turns out, it's surprisingly simple to make a Chrome extension, at
least the kind that I made that serves as a page override. I say this after
scanning the documentation for the types of extensions that need to interact
with the page that a user is viewing. Those look a little more complicated,
but not that much.

## What's a Chrome Extension, Anyway?
A Chrome extension can come in many forms, but fundamentally, it's just a
packaged up collection of HTML, CSS, and JavaScript. They're just like web
pages and can leverage the same browser APIs. When you're building a Chrome
extension, you write your code, then package it up into a ZIP file with a
`.crx` suffix. If you leverage the Chrome Developer Dashboard, you can
package up your files as part of the upload process, or package it yourself then upload it. 
Alternatively, you can
distribute the extension yourself and forgo the $5 developer fee, but it's
up to you to decide how much extra work you want to do. I paid the fee. 

## The Code
When building the Chrome extension I call "Yololo", I made a new GitHub
repository, which you can view [here](https://github.com/talum/yololo) for
the full source.

Basically, I spun up another React app and configured Webpack as the build
tool.

From the `yololo` directory, I initialized npm and then installed webpack
locally with:

```javascript
npm init
npm install --save-dev webpack
```

Then, since I'm using ES6 and React, I configured Babel with Webpack.

`npm install --save-dev babel-loader babel-core style-loader`

Next, I set up my `webpack.config.js`:

```javascript

const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
    ]
  }
};

```

In the configs here, you'll see that I'm telling Webpack which loader to use
based on a Regex match. So anything that ends with `.js` or `.jsx` will be
handled by the `babel-loader`, and anything that ends in `.css` will be
handled by the `style-loader`.

To enable the plugins, I installed a couple presets and then created a `.babelrc` file. 

`npm install babel-preset-env --save-dev`

`npm install react --save`

```javascript

//.babelrc
{
  "presets":[
      "es2015", "react"
  ]
}

```

After all of that config was ready, I
copied over the React components and the CSS from the [Commits](https://github.com/talum/commits) app and installed dependencies.

`npm install --save axios react-dom react-mousetrap`

To build the app, I ran `npm build`.

Now this is where the Chrome extension-specific parts come into play. The
entry point into my Chrome extension is just an `index.html` file. This will
be specified in the `manifest.json` file for the extension. 

In the `index.html`, I include some basic metadata and also include a script
tag link to the bundled version of the application's JavaScript.

Trying to figure out what exactly that placeholder tab is called in
Chrome-speak was a bit difficult, but it turns out it's called an "[Override
Page](https://developer.chrome.com/extensions/override)". Building one
requires you to add a simple config to the `manifest.json`. You addd a key
of `chrome_url_overrides`, and then specify which kind of page to override
and with what.

```javascript
{
  "manifest_version": 2,
  "name": "yololo",
  "version": "0.2",
  "description": "Displays a commit message from a fis-labs repository",
  "chrome_url_overrides": {
    "newtab": "index.html"
  },
  "icons": { "16": "yololo-16.png", "128": "yololo-128.png" }
}
```

Great, after that, I added a couple icons to the directory and referenced
them also within the `manifest.json`. That tells Chrome what to display in
the store and as the icon in the Chrome toolbar.

To test the app, I played around with it in developer mode using [these
steps](https://developer.chrome.com/extensions/getstarted). For ease of
reference, here's the TLDR;

1. Go to `chrome:://extensions` in your browser
2. Ensure that Developer mode is on
3. Click `Load unpacked extension...`
4. Select the directory where the extension lives

Next up, when I was pretty sure everything worked well enough, I set up my developer dashboard, paid a fee, and then uploaded a
zipped version of my app. For now, the extension is only available to a
select group of test users, but that's just because I don't think anyone
else will find this quite as funny and useful as I do.

Anyway, that's all there was to making a Chrome extension. Most of the
difficulty lay in setting up Webpack, not so much in configuring the
extension. Until next time, when I dive into building a Slack slash command,
happy coding.





# Resources
- [Chrome Extension Overview](https://developer.chrome.com/extensions/overview)
- [Chrome Extension Override Pages](https://developer.chrome.com/extensions/override)
- [Chrome Extension Distribution](https://developer.chrome.com/extensions/hosting)
- [Webpack](https://webpack.js.org/)
- [Babel](https://babeljs.io/docs/setup#installation)

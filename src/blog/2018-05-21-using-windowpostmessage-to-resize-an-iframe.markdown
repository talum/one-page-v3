---
layout: post
title: "Using Window.postMessage to resize an iframe"
date: 2018-05-21T23:03:38-04:00
comments: true
categories: ["javascript"]
---

![Jupyter
Lab](https://s3-us-west-2.amazonaws.com/talum.github.io/jupyter_lab.gif)

# Jupyter Notebooks on Learn
Recently, I worked on integrating [Jupyter Notebooks](http://jupyter.org/)
into Learn as part of the data science course launch. Jupyter Notebooks are a tool commonly used by data scientists
to create and share documents that contain code and visualizations. They're
super interactive and allow you to execute code as though you're working in
a REPL.

To integrate the Jupyter Notebook on Learn, we actually used the same
backend as we used for the Learn IDE. The biggest difference in this case
was that we'd start a process to run the Jupyter server in a Docker
container and expose the port, and, from the
client (the browser), make a request to the IDE server in order to fetch the
contents of the Jupyter Notebook and serve it in an iframe.

I'm doing a lot of handwaving here because in this post, I want to focus on
how we handled setting the height of the iframe within the Learn lesson
pane.

As it turns out, in order to get an iframe to fit the content within it,
it's necessary to explicitly set the height, and you can do that by using
`window.postMessage`.

# Window.postMessage
[Window.postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)
is a method that enables cross communication between window objects. Since
we're serving an iframe on Learn, what we needed was a way for the iframe to
communicate to its parent and set the right height.

The syntax is thankfully straightforward.

```
targetWindow.postMessage(message, targetOrigin, [transfer]);
```

The `targetWindow` is the window you want to send a message to. The
`message` is the data you want to send, and the `targetOrigin` specifies
what the origin of the `targetWindow` needs to be in order for the message
to be sent. Specifying both the `targetWindow` and the `targetOrigin` gives
you some safeguard against sending data to some other source you might not
want to communicate with.

On the other side, from the `targetWindow`, you can set up a listener for
the message.

That would look something like this:

```javascript
window.addEventListener("message", receiveMessage, false);

function receiveMessage(event)
{
  if (event.origin !== "http://example.org:8080")
    return;

  // ...
}

```

Here, you're listening for a "message" event and respond to it with a
callback. The function `receiveMessage` receives the event with properties
of `data`, `origin`, and `source`. What's neat here is that you can and
should be explicit about which origins you accept messages from, so you can
doubly ensure that you don't listen to any unwanted messages.

To make Jupyter Notebooks work on Learn, I adopted this approach for setting
the iframe height on the Learn lesson page.

In the custom jupyter scripts, I added the following lines of code to grab
the height of the notebook and send it to the parent window:

```javascript
 define([
    'base/js/namespace',
    'base/js/promises'
  ], function(Jupyter, promises) {
     promises.notebook_loaded.then(function(appname) {
         // Sends the desired height to the iframe parent
         var frameHeight = \$("#notebook-container").height()
         window.parent.postMessage(frameHeight, '$LEARN_ORIGIN')
     })
  })
```

Then, on the Learn side, I added the following blocks to listen for the
right message and resize the iframe rendered through React:

```javascript
import React from 'react'

const handleMessage = (e, url) => {
  // only listen for messages from the jupyter container
  const urlParser = document.createElement('a')
  urlParser.href = url

  if (e.origin === `${urlParser.protocol}//${urlParser.host}`) {
    const height = e.data
    const jupyterIFrame = document.getElementById('js--jupyter-frame')
    jupyterIFrame.height = `${height}px`
  }
}

const resizeIframe = (url) => {
  window.addEventListener('message', e => handleMessage(e, url), false)
}


const JupyterIframe = ({ url }) => {
  return (
    <iframe
      id="js--jupyter-frame"
      src={url}
      frameBorder="0"
      width="100%"
      scrolling="no"
      onLoad={resizeIframe(url)}
    />
  )
}
```

Because this only sends the iframe height once, future iterations built upon
this idea to continuously send the height as it changes to avoid weird
double scrollbars and the like.

Using `postMessage` though was critical to getting the iframe to resize and
to render at the right height the majority of the time, which is, all in
all, pretty cool.

## Resources
- [Window.postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)
- [Resize
  iframe](https://stackoverflow.com/questions/819416/adjust-width-height-of-iframe-to-fit-with-content-in-it)

---
layout: post
title: "Building an In-Browser IDE"
date: 2017-11-22T14:06:38-05:00
comments: true
categories: ["React", "Elixir", "Redux"]
---

![Learn IDE in Browser](https://s3-us-west-2.amazonaws.com/talum.github.io/learnIde6.gif)

We put an IDE in the browser!

*The following post first appeared on the [Flatiron
School blog](http://blog.flatironschool.com/built-learn-ide-browser/).*

This week, Flatiron School’s Engineering team rolled out the Learn IDE (Integrated Development Environment) in browser – complete with file tree, text editor, and terminal window. Now, when you do a lab on Flatiron’s Learn.co platform, you need only click on the “Open IDE” button to launch a functional development environment right in your browser!

We’re particularly excited about this feature because it allows students new to coding to get a taste of programming with real tools that developers use on the job. Unlike a REPL (a read-eval-print-loop) that executes a few lines of simple code, the IDE in browser allows students to experience the more complex interaction between editing different files and executing them from a command line. We noticed that setting up a local development environment, or even downloading our Learn IDE, was a common barrier to entry for budding developers. In building the IDE in browser, we sought to provide a simpler entry point for people to get started on their programming journeys.

## How It Works

When you click on the “Open IDE” button, you’ll see the IDE open up in split-screen mode beside your lesson. To the left is the file tree, the list of all your directories and files. When you right-click on these files, you’ll see a menu of actions you can perform on the file or directory. Click on a file and you’ll see its contents populate in the editor window.

In the editor, you’ll be able to modify your file’s contents. To save your work, click off the editor pane, and we’ll trigger a save event. You can also save by using the keyboard shortcuts CMD+s on Mac or CTRL+son Windows.

To run the test suite for a lab, click on the terminal pane and type learn testand hit enter. To submit your lab, just run learn submit. This command sends your test results to Learn and opens a pull request on GitHub, signaling to Learn that you’re done.

Although split-screen mode is enabled by default, you can toggle between split-screen and full-screen modes by clicking on the button in the menu.

## How We Built It

### The Back-End
For our back-end IDE servers, we chose to use the Phoenix framework, written in Elixir. Elixir, which leverages the Erlang VM, can handle millions of connections. It’s also scalable and concurrent, fault-tolerant, functional, and elegant. Those sound like a lot of buzzwords; boiling this down, that means that Phoenix gives us an app that is fast, self-healing (restartable after crashes), and fairly easy to make sense of and maintain. If you like Ruby, like most of us on the engineering team, you’ll probably also like Elixir. The Phoenix framework, it has been said, is like Rails – the good parts.

In broad strokes, the IDE backend is responsible for spinning up new Docker containers for each student who starts doing a lab on Learn. We use Phoenix sockets to communicate from the browser client to the server, and we pipe commands from the student’s terminal into his or her corresponding Docker container for a particular lab and also pipe the container output back to the user. Meanwhile, we also have a process watching for file system changes and sending those down to the client so we can construct a representation of the file tree in what we call the file tree pane. What’s nice about our backend implementation is that it is flexible enough to support both the existing Atom client as well as the new browser client.

### The Front-End
As far as front-end tools are concerned, we opted to use React and Redux as part of our continuing migration from legacy front-end libraries Backbone, Marionette, and Alt.js. For the file tree, we built our own React component that recurses over a JSON payload containing the names of the files and directories in the student’s container on the remote server. Although several packages implementing file trees exist, we found that making our data match the format the packages’ APIs accepted would be just as much work, if not more. By deciding to build our own component, we were also able to more easily incorporate our CSS library and add custom menu behavior.

For the editor and terminal, we are using open-source libraries Ace and Xterm within React components.

When a student starts working on a lab on Learn, we initialize a Phoenix socket connection to our backend server for them. They join a Phoenix channel specific to their lab, and from there we start pushing messages into the channel to which the server responds. For most interactions that accept client input, whether related to the file system or the terminal, we first funnel that message through Redux, and then use custom middleware to push messages into the channel.

For example, this is a simplified example of the middleware function we wrote:

```javascript

const middleware = () => {
    return store => {
      return next => action => {
        switch (action.type) {
          case TERMINAL_INPUT:
            this.channel.push('terminal_input', {data: encode(action.payload)})
            break
          case REQUEST_CREATE_FILE:
            this.channel.push('file_system_event', {data: action})
            break
        }
        next(action)
      }
    }
}


```

Here, you’ll see that when an action with a payload type of “TERMINAL_INPUT” passes through our reducers, we’ll also push a message over the websocket into the Phoenix channel. The same is true for the “REQUEST_CREATE_FILE” event, which is dispatched when a user creates a file from the file tree pane and modal.

Likewise, when we receive messages back from the server through the channel via the socket connection, we dispatch custom Redux actions to change the state of our application. This strategy allows us to replay history for easier debugging and also lets us isolate side effects of impure functions.

## Technical Challenges and Wins

### Legacy Code
One of the largest difficulties with implementing the IDE in browser was not creating React components themselves, but making the React-Redux ecosystem communicate with existing code written in Backbone and Marionette. In order to facilitate communication between a legacy Radio event bus that dispatches and listens for certain global events, we built a Radio-Redux proxy in which we set up listeners for Radio events, and then dispatch Redux actions in response to them. This allows us to create a bridge between these divergent systems. Of course, because certain features of our website also need to read from the new state stored in Redux, we also enabled a query interface so that certain sub-apps within Learn can change their behavior based on the Redux state.

For example, our “Open IDE” button is rendered by a Backbone-Marionette app. In order to make the IDE open, we trigger a radio event.

```javascript

onOpenIdeInBrowserClick() {
   radio.trigger('open:ideInBrowser')
}

```

And then to respond to that event, we have written a proxy that listens for that event and then dispatches an action. You’ll notice that this proxy accepts an argument of “store” and is actually set up when we create the Redux store.

```javascript

import Radio from 'backbone.radio'
import {
  openIdeInBrowser
} from 'lib/redux/actions'
export default (store) => {
  let radio = Radio.channel('global')
  radio.on('open:ideInBrowser', () => {
    store.dispatch(openIdeInBrowser())
  })
}

```

Another challenge was leveling up the team on Elixir and Phoenix, as well as React and Redux. Although we have been using React in our codebase for a little over a year, at that time, we were using a different state management library called Alt.js, which is an implementation of the Flux architecture pattern. Although Alt.js served our purposes at the time, Redux has become the preferred state management tool because of its simplicity and clarity. Thus, we are slowly migrating over legacy code to use Redux as it becomes necessary. To remedy much of these challenges, we have been pairing extensively to encourage knowledge sharing as well as develop more robust, maintainable solutions.

### Communication and Spikes

While building a complex feature with rotating teams, we began keeping a developers’ log to facilitate communication between parallel teams that have different people rolling on and off each day during development. By writing down what we achieved and what we were working on, we were able to enrich the context of the user stories and tasks listed in our project management tools and thus streamline some of the development process. We also did several mini spikes to get a handle on the complexity of the project and to figure out which tools would best suit our purposes during actual development.

Ultimately, this is a very exciting new tool for our students and was a delight to build. We can’t wait to iterate on it some more!


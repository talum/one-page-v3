---
layout: post
title: "How and When to Start Using tmux"
date: 2018-03-03 22:22:10 -0500
comments: true
categories: ["tmux"]
---

![tmux](https://s3-us-west-2.amazonaws.com/talum.github.io/tmux.gif)

Over the past week, I've been trying to start using tmux in earnest.

On a typical day, I don't need to start a process in more than two or three
terminal tabs. But this past week, I reached a breaking point and possibly a new
record when I had to get practically the entire system I develop on working locally!

This included the following:
- the main Rails monolith
- webpack for all the app's JavaScript
- a message broker app written in Sinatra
- A sneakers process to manage workers
- A Dockerized version of some other assorted dependencies, including
  elasticsearch, postgres, redis, and rabbitMQ
- a Phoenix app for our IDE backend
- a Rails console
- localtunnel to expose localhost to the world

Navigating between all these windows became rather onerous, especially since
I am just awful at tab management. And then there's the trouble that I've
been using vim as my text editor lately, so that takes yet another window,
or two, since my work was spanning multiple codebases.

Tmux solves most of that problem while also giving you the opportunity to
attach and detach from sessions. There are even plugins that allow you to
persist your layout between sessions or system reboots, which I hope to look
more into soon.

My secondary reason was to remote pair with tmate, which is way more
performant than trying to screenshare and give remote control to someone
using software like Zoom.us or Screenhero.

Okay, so that's why you might want to start using tmux. I wouldn't start using
it until you really need it. Here's how you would get started and essential
things you need to know.

## tmux setup
1. Assuming you have Homebrew installed, install tmux using `brew install
   tmux`
2. Do yourself a favor and set up some basic configs in your `.tmux.conf`
   file.
   - I turned on vi bindings so that I can copy and paste easier. Add this line to that file if you too want to reap the benefits:
   `set-window-option -g mode-keys vi`
   - I also switched my default shell to `zsh`, which is another work in
     progress, but anyway, this is the config for that `set-option -g
     default-shell /bin/zsh`.

## tmux essential commands
Great, now that you've got tmux installed, it's time to learn some basic
commands.

Once you're in a tmux session, anything you do to talk to tmux will require
that you use a prefix key. The default prefix key is `ctrl+b`.

To start a session with a name, which you most likely want to do, run the
following command:

`tmux new -s [name of session]`

Woohoo, now that should put you in a tmux session. Now you might want to
split the pane so you can look at multiple programs at the same time.

This is where the prefix key comes in. If you want to split the pane
horizontally, use `ctrl+b "`.

If you want to split the pane vertically, use `ctrl+b %'`.

Now, you'll probably want to navigate between those panes. You can write
more bindings if you want, but the default allows you to navigate using
`ctrl+b [arrow key]`. If you wanted to go right, for example, you'd type
`ctrl+b` then the right arrow.

There's a good chance that there are some programs you just want to glance
at while there are others you want to see more detail from. Resizing your
pane might be a good idea. To do this, you get into the tmux prompt.

`ctrl+b :` gets you the prompt.

To resize the pane, you type `resize-pane` with a direction flag and the
number of lines to move.

For example:
`ctrl+b :`
`resize-pane -D 10`

That's all well and good, but now you might want to create different windows
with layouts to see even more programs!

Enter windows. To create a new tab, use `ctrl+b c`. This should place you into
another window, where you can create new panes. To navigate between windows, you
can use the prefix with the window number.

You can even name your windows. I like
naming my windows because as I mentioned, I'm terrible at remembering where
things are. To name your window, use `ctrl+b ,` and enter the name.

What's that? You need to copy and paste. With vi bindings, this is a little
simpler. First, enter scroll mode using `ctrl+b [`. Then hit the spacebar
and use the arrow keys to select your desired output and hit enter. To paste, use `ctrl+b
]`.

So now you've got your workspace all set up, but you want to detach from
your tmux session. Sounds chill, you can detach using `ctrl+b d`.

Whoops, but you forgot you had to make one more change before leaving for
the day. Go ahead and reattach to that session using `tmux -a -t [name of
session]`.

Tmux can be especially useful when you ssh onto remote boxes and want to
reattach to a session you were in before.


## tmate
So that's great! You're using tmux. And now you're thinking to yourself, but
wouldn't it be great if I could pair remotely with a colleague while using
tmux.

This is where tmate comes in! Tmate is a fork of tmux that lets you share
your terminal with whomever you want. I honestly haven't dug too deep into
how it works, but you install it with homebrew (`brew install tmate`) and
launch it using `tmate`. That'll give you an address that other people can
`ssh` into. It's pretty awesome. I recommend trying it out if you need to
pair remotely and other solutions are too laggy.

All right, so that is pretty much all for now. This is just the beginning,
the essentials for getting started with tmux, but I'm pretty excited to
learn more and find more applications for it.

### Resources
- [A Gentle Introduction to tmux](https://hackernoon.com/a-gentle-introduction-to-tmux-8d784c404340)
- [tmux cheatsheet](https://gist.github.com/henrik/1967800)
- [tmate](https://tmate.io/)

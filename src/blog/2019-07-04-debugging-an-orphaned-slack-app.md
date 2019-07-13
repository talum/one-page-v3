---
layout: post
title: "Debugging an Orphaned Slack App"
date: 2019-07-04T21:43:12-05:00
comments: true
categories: ["slack", "node"]
---

The last thing people think about when they leave an organization is their
Slack app ownership. And as soon as someone's account gets
deactivated, so do all of the apps they manage.

For some apps, it's not so bad, but for apps that have become "business
critical", it's a huge pain. At my current company, we have a hubot app that
we've called nubot for some reason. Hubot doesn't do much besides spit out
our company values and aggregate karma for employees, but as soon as it goes
missing, everyone freaks out. It causes an all-out Slack panic. People start
`@channel`ing and opening tech tickets. It's insanity. What began as a fun project has turned into
something that our teammates rely on and expect to exist.

It happened again recently when the developer who set up a node app and
corresponding Slack app to facilitate a deployment flow for one of our internal apps from a QA server.
He was very conscientous about providing training on the deployment flow
itself, but we all collectively forgot to ask about the Slack integration.
So, when our former teammate's Slack account was deactivated, we lost the ability to
deploy our app to a QA server via a slash command.

Our options were as follows:
- Ship straight to prod (totally just kidding)
- Deploy with a cURL request to CircleCI and some query params
- Spend some time reconfiguring the Slack slash command.

The last option is what I ended up doing the day before the July 4th
holiday. This post will describe the debugging process I used to figure out
how to set up the app again.

## Slack Apps
First, I logged into our Slack workspace and poked around at the apps. It
was a little confusing because there were "custom integrations" with slash
commands, as well as full-fledged apps with slash commands. I mistakenly thought that this setup
was for a slash command via a custom integration, which is where I wasted
probably 10 minutes. As it turns out, custom integrations will be deprecated
and possibly removed.

My next step was to try to look at the settings for the old app. Because I
am not a workspace admin, I could not find the app in the first place, so I
had to get someone to send a link to me. (The app didn't appear for me in
the "Manage" tab of the Apps directory in the Slack workspace.)

After I found the orphaned app, our new problem became trying to figure out
how to set it up again. Since no other collaborators were on the app, no one
else could see the configuration, which was troubling.

Thus began some guess and checking, which might just be my favorite problem
solving method. (Honestly not sure if that is sarcastic or not.)

## The app code
First, a fellow teammate and I looked at
the source code and deduced that the code itself was a simple enough
function running as a node app on one of our servers. We located the server and eventually found a way to
log into it. We also tracked down its IP address.

Then, we started issuing cURL requests to hit the application. After
confirming it was reachable, we started configuring our app and resetting
environment variables, one by one.

## Configuring a new app
Following Slack's [introduction to
apps](https://api.slack.com/start/overview), I started setting up a new app.
This required a lot of guessing, mostly because I didn't want to spend all
that much time investing in learning how Slack apps worked. (Our mission was
to unblock deployment, not learn everything there was to know about Slack
apps.)

Following some experimenting, I set up a new app with a slash command
configured to hit our internal app's IP address. While testing the newly
configured slash command, we started getting messages back!

But those messages told us that our actions were not authorized. So we began
debugging the permissions and the environment variables.

Unfortunately, the method for deployment of our internal app, called leeroy,
was not well documented. The code was on the server, and so were environment
variables, but it was not clear at all how they got there. It seemed like we
didn't use any sort of automated deployment tool. So...we guessed. And set
the environment variables manually.

This got us farther. We started getting different error messages back,
which led us to begin tinkering with the Slack app's permissioning.
Referencing the original Slack app's description of actions, I started
adding new permissions to the Slack app I created. And slowly but surely, we
figured it out. Thank goodness every error message was slightly different.
They weren't particularly descriptive, but they were different!

Line by line, we issued cURL requests until we got a deployment on CircleCI
to kick off successfully.

And then I made sure to add another collaborator on the Slack app so in the
event that I leave, deployment wouldn't be blocked and knowledge about this
flow wouldn't evaporate into the ether.

## Lessons Learned
- Consider setting up a Slack admin user so that custom apps don't die as
  soon as their owners leave
- At least add more collaborators than one to an app that is "important"
- Do a Slack app audit when people offboard
- Document "experiments" better if they become business critical


As for me, I'm now pretty interested in learning more about Slack apps, so
I'm hoping to build a few things over the next couple months to get more
accustomed to the API. Hopefully this helps anyone else debugging a Slack
app who was also blindsided by a teammate's departure.






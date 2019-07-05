---
layout: post
title: "Debugging a Slack App"
date: 2019-07-04T21:43:12-05:00
comments: true
categories: ["slack", "node"]
---

I think one of Slack's greatest flaws is that apps and integrations get
deactivated as soon as the person who set up the configuration leaves the
organization. After one of my coworkers left a few years ago, our hubot
integration was deactivated. After some tinkering around, I set it back up but now as soon as I leave, hubot will go MIA again.

All of that's fine for some of the more trivial applications (hubot has
recently become "critical" in that our staff will go wild as soon as the
ability to grant karma goes away), but for other integrations, it's a real
problem.

Such was the case recently when the developer who set up a Slack slash
command to facilitate deployment of an app I work on to a QA server. As soon as his account on Slack was deactivated, so was our ability to deploy this app to QA. Our options were as follows:
- Ship straight to prod (just kidding)
- Deploy with a cURL request and some query params
- Spend some time reconfiguring the Slack slash command.

The last option is what I ended up doing the day before the July 4th holiday.

# Slack app versus custom integration
# Debugging the code and the environment variables
# Decoding the error messages step by step
# Slack tokens and permissions

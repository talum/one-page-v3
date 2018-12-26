---
layout: post
title: "Build a Slash Command"
date: 2017-11-06 11:16:08 -0500 
comments: true
categories: ["slack", "slash command"]
---

Now, in our product development journey of "Commits", we've built a Phoenix
API as well as a React front-end and a Chrome extension to consume it. That's
all great! But, then I thought to myself, what if you also built a Slack app
so that when you typed `/yololo` in Slack, you'd get a random commit message
on demand?

Yes, what. if.

This is also not terribly difficult!

You'll need a Slack account and admin access to a Slack team. 

Head over to the [Slack API](https://api.slack.com) to get started. Find the
CTA for building a new app. Right now, it looks like this.

![Slack API](https://s3-us-west-2.amazonaws.com/talum.github.io/build-slack.png)

You can click on
"Start building" or "Your apps" and end up in a view of your apps. Be sure
to click on "Create New App" if you aren't prompted with a form to create a
new app. Fill out the form and select your development workspace.

![Create App](https://s3-us-west-2.amazonaws.com/talum.github.io/slash-command.png)

Next, click on your app and configure it. Add basic information and display
information. In other words, give it a name and explain how it works.

Next, under the Features menu, click on "Slash commands." This is where
you'll configure the command and the request URL for the app.

![Slash](https://s3-us-west-2.amazonaws.com/talum.github.io/create-app.png)

For my app, I made the command `/yololo` and the request URL `https://commits-by-logan.herokuapp.com/api/help`. 

Finally, I created such an API endpoint in my Phoenix app. Code changes
incoming. Because I'm just
surfacing existing data in a different way, I simply added a new route to
the router.

```elixir
# /commits/lib/commits_web/router.ex

# some omitted code...

  scope "/api", CommitsWeb do
    pipe_through :api

    resources "/commit_messages", CommitMessageController, except: [:new, :edit, :update, :delete]
    post "/help", CommitMessageController, :help
  end

```

That will map a request to our URL to the `help` action in the `CommitMessageController`.

Adding the `help` action is fairly straightforward. Instead of returning
multiple commit messages, we just need to select one at random.

```elixir
# /commits/lib/commits_web/controllers_commit_message_controller.ex

# some omitted code

  def help(conn, _params) do
    commit_message = Logs.get_random_message()
    render(conn, "help.json", commit_message: commit_message)
  end

```

The `get_random_message` function is something I had to add to the `Log`
module.

```elixir
# /commits/lib/commits/logs/logs.ex

# more omitted code

  def get_random_message do
    count = Repo.all(CommitMessage)
            |> Enum.count
    random_id = :rand.uniform(count)

    Repo.get!(CommitMessage, random_id)
  end

```

You'll see that I'm making use of the `:rand` function from Erlang.

After the code changes were all set, I redeployed everything on Heroku and
started using the command! It is equally hilarious, more so because I
configured it in the Slack app with a photo of my co-worker. It's almost as
though he's talking to everyone in the channel...but I made sure to identify
it as a bot, chill.

Finally, that's a wrap on this project. Phoenix, React, ftw.


# Resources
- [Slash commands](https://api.slack.com/slash-commands)

---
layout: post
title: "Building a Basic Phoenix API"
date: 2017-08-27T23:09:15-04:00
comments: true
categories: ["elixir", "phoenix"]
---

![Commits](https://s3-us-west-2.amazonaws.com/talum.github.io/commits.gif)

Recently, I started learning Phoenix, a Rails-like framework written in
Elixir that has sometimes been called "Rails, the Good Parts". It's often easier for me to
learn something when I actually have to apply it, so I decided to write a
little app to do some practice for when I'm not actively staffed on a
Phoenix project at work.

## The Project
When I make projects, I like to choose something either ridiculous or that
I care about. The best projects I make combine both. This time
around, I built an app that pulls the commit messages authored by an old co-worker
of mine, from across our codebase. For context, he writes (or possibly just wrote) the
most hilarious commit messages, and it just makes me laugh to see a couple
of them every day. I often stumbled upon them while working on
something at work, but I figured, why not surface them at will?

So, the app I built has a seed file that contains a script that hits the GitHub API to generate
data. There's also an API to surface those messages. The API just returns
some JSON. What's nice about this approach is that a flexible API gives me the
ability the surface the data in a number of ways, including a web app, a Slackbot, and
a Chrome Extension. (I'm playing around with this idea of creating bundles
of software as a product.) But I digress. Today, we're talking about
building an API in Phoenix.

## Generators
Like Rails, Phoenix also comes with some nifty generators. Because my app is
so basic, I just needed to generate one controller, a view, and what are now known in
Phoenix as "schemas." By running this command, I was able to create a
scaffold in a few seconds:

`mix phx.gen.json CommitMessage commit_messages
committed_at:datetime content:string repo_name:string`.

Then, as instructed, I added the line:

`resources "/commit_messages", CommitMessageController` to the api scope
within the router
located in `lib/commits_web/router.ex`, which defines the route mapping.
Because I didn't need a bunch of extra routes, I changed this in Rails-like
fashion to `resources "/commit_messages", CommitMessagesController, except:
[:new, :edit, :update, :delete]`.

After that was all set, I ran the migration with `mix ecto.migrate`. This
gives me just a single table full of commit messages.

A few things to note about Phoenix:
- Unlike Rails, where you can make controllers inherit from other
  controllers, the idea in Phoenix is to have a series of composable plugs,
  which can be organized into pipelines.
- Plugs function like middleware, transforming the connection or `conn`.
  When a browser makes a request, that makes its way to the Endpoint, and
  then to the router and controller.

## The Controller
The nifty generator created a controller called
`CommitsWeb.CommitMessageController`. You'll notice that everything is
properly namespaced in contexts in Phoenix 1.3. Anything that relates
strictly to the web, such as a controller and router, will be found under
the `CommitsWeb` namespace. Other parts of the application, such as the
data-mapping layer, are namespaced under `Commits`. I chose to nest
everything in a context called `Logs`. This separation of concerns allows us
to think about the web views and behaviors as separate from the business
logic of the application.

Also, you'll see that
Phoenix doesn't auto-pluralize everything as Rails does. The argument is
that pluralization is useful most of the time, but when it fails, it fails
pretty hard.

After some pruning, my controller looked like this:

```elixir
defmodule CommitsWeb.CommitMessageController do
  use CommitsWeb, :controller

  alias Commits.Logs

  action_fallback CommitsWeb.FallbackController

  def index(conn, _params) do
    commit_messages = Logs.list_commit_messages()
    render(conn, "index.json", commit_messages: commit_messages)
  end

  def show(conn, %{"id" => id}) do
    commit_message = Logs.get_commit_message!(id)
    render(conn, "show.json", commit_message: commit_message)
  end

end

```
Most of that was generated, but you can probaby get the gist of what'
s happening. The index action returns a list of all the commit messages as
json, while the show just returns a single one.

## Ecto, Repo, and the Data

**Ecto** is the "persistence layer" of the application. It's the equivalent of
ActiveRecord in Rails, and it does essentially the same function of mapping
database columns to fields in a data structure.

The **repo** is an API for holding data. You can fetch, insert, or modify data
in the database using `Repo`, which is a module you can define to have
custom implementations of an interface. Usually, though,
it'll have some configs to tell it to talk to a database.

When we take a look at the `Commits.Log` module, we can take a closer look
at how we're using `Repo` to fetch data.

```elixir
# /lib/commits/logs/logs.ex

defmodule Commits.Logs do
  import Ecto.Query, warn: false
  alias Commits.Repo

  alias Commits.Logs.CommitMessage

  def list_commit_messages do
    Repo.all(CommitMessage)
  end

  def get_commit_message!(id), do: Repo.get!(CommitMessage, id)

```

Above, you'll see the module code after some pruning. I removed the
documentation notes. Here, we're using the `Repo` module
to fetch data. Again, most of this was generated, so I'm just interpreting
it for my own knowledge (and for yours?).

Okay, so with that all set, we just need to take a quick look at the
"views", which in the case of an API are some functions to return the right
JSON.

## Views and Templates

This is one of the parts that trips me up most about Phoenix, so I'm
referencing the book "Programming Phoenix" by Chris McCord, Bruce Tate, and
Jose Valim, for this especially.

In Phoenix, a view is a module responsible for rendering. The templates are
fragments of HTML that may contain some embedded Elixir. What's interesting
to note is that the view is just a module, and the templates are just
functions. In other words, the template gets compiled into a function in the
view, so when the render functions defined in the view are called from the
controller, they are *super fast*.

Here's a peek at the view:

```elixir

# lib/commits_web/views/commit_message_view.ex

defmodule CommitsWeb.CommitMessageView do
  use CommitsWeb, :view
  alias CommitsWeb.CommitMessageView

  def render("index.json", %{commit_messages: commit_messages}) do
    %{data: render_many(commit_messages, CommitMessageView, "commit_message.json")}
  end

  def render("show.json", %{commit_message: commit_message}) do
    %{data: render_one(commit_message, CommitMessageView, "commit_message.json")}
  end

  def render("commit_message.json", %{commit_message: commit_message}) do
    %{id: commit_message.id,
      content: commit_message.content,
      committed_at: commit_message.committed_at,
      repo_name: commit_message.repo_name}
  end

end

```
For other web apps with rich views, you'd probably define templates. In this
case, because we're making an API, we just need to return some JSON, as
formatted above.

And with that, we have a basic API in Phoenix. You can see the final product
for the web app [here](https://commits-by-logan.herokuapp.com/). More to come on the React
front-end, the Slackbot, and the Chrome Extension.


## Resources
- [Programming
  Phoenix](https://pragprog.com/book/phoenix/programming-phoenix)
- [Phoenix Docs](https://hexdocs.pm/phoenix/overview.html)
- [Elixir Lang](https://elixir-lang.org/)

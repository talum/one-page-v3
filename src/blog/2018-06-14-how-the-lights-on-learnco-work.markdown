---
layout: post
title: "How the Lights on Learn.co Work"
date: 2018-06-14T21:18:17-04:00
comments: true
categories: 
---

I originally wrote this post for the brand-new [Flatiron Labs Engineering
Blog](https://medium.com/flatiron-labs/how-do-the-lights-on-learn-co-work-400bb47cee38),
but I'm reposting it here.

![Learn](https://s3-us-west-2.amazonaws.com/talum.github.io/learn.png)

## Test-driven Learning on Learn.co
If you've ever done a lesson on [Learn.co](https://learn.co/), one of the first things you'll notice is the lights. That's what we affectionately call the little icons on the right of our lesson pages - those little markers of progress that change whenever you complete a required task, or, "assessment" in code-speak, for the lesson. The lights on Learn.co are one of the most important, beloved, and magical features on the platform, and they're also one of my favorite parts of the app.

When I first joined Learn.co over two years ago as a student, I remember being mystified by how forking a repository on GitHub could result in a flash of green on my lesson page. When working on a lab, I'd run tests from my terminal using the learn command. I'd see the test light flicker to red when my local tests failed and finally to green when I made them all pass - all without me reloading the page!

What I didn't realize back then was how complex the system that handles marking progress and flipping lights actually is. It seems simple enough to the user: after taking an action like running tests or submitting a pull request to GitHub, the UI changes. Behind the scenes, however, lies a fairly complicated system that I'll outline in this post to answer the perennial question "how do the lights work?"

## 1. Introduction to the Learn.co curriculum
Our Learn.co platform has many lesson types, but mainly they can be distilled into either readmes or labs. Readmes are informational text and, well, just need to be read and marked complete from the web app. Labs, however, contain test suites that students need to make pass in order to complete the lesson. It's in this manner that we support a test-driven approach to learning.

All of the curriculum on Learn.co is stored on GitHub. Every lesson has an associated GitHub repository, and when students do work, we ask them to fork a repository from our GitHub organization to their personal accounts, so they have a copy and can keep track of their work and submit it when done. In addition, for labs, the most common types of lights are the Fork, Local Build, and Pull Request.

## 2. Fetching the lab
Now, let's begin our journey to discover how the lights work in the [learn-co gem](https://github.com/learn-co). The learn-co gem provides a command line interface for users to interact with the Learn platform. It's open-source (we'd love your contributions!) and actually consists of many sub gems, including the learn-open, learn-test, and learn-submit gems.

The learn-open gem is responsible for fetching the right GitHub repository for a lab, forking it if the student hasn't already, and cloning it down into the student's environment. It also handles installing all the dependencies for the lab. When the student has the learn-co gem installed, all he or she has to do is run `learn open` from their command line prompt to get the repository for their current lesson cloned to their environment. Then, the work begins! Students not using the learn-co gem to open the lesson can also manually fork and clone from GitHub, but we provide this gem to make it easier for students to get started.

## 3. Running the test suite
When students are working on the lab, we encourage them to make the tests pass one at a time, similar to how developers in the "real world" would take a totally TDD approach to building a feature. This is where the learn-test gem comes into play.

Learn.co supports a number of languages, including Ruby, JavaScript, Python, Java, and C#. Each of those languages has its own testing frameworks and conventions for how to run tests and where to store test files. The learn-test gem handles running and formatting test results. When a student executes the `learn test` command from their terminal, the learn-test gem looks at the contents of the GitHub repository for the lab and detects which test strategy to use. It then runs the corresponding test suite. The gem writes those test results to a temporary file and formats them into a JSON payload which is sent to an endpoint on one of our internal services called "Ironbroker." (Because we're the Flatiron School, we have a real love of the iron theme.)
At this point, the payload created from the test results looks something like this:

```
{
  username: username,
  github_user_id: user_id,
  learn_oauth_token: learn_oauth_token,
  repo_name: repo_name,
  build: {
    test_suite: [{
    framework: 'rspec',
    formatted_output: test_output
   }]
  },
  examples: output[:stats][:total],
  passing_count: output[:stats][:passes],
  pending_count: output[:stats][:skipped],
  failure_count: output[:stats][:errors]
}
```

## 4. Delivering the results
Every time a student runs the `learn test` command, a payload like this one is sent to Ironbroker, and it's these payloads that begin the submission process. They move through the applications in our system, getting augmented with more data until they get converted to a UI change. More on that soon, though.

Ironbroker is a Sinatra app that is responsible for brokering messages, which in our case amounts to parsing payloads, validating them, persisting them, and then publishing them off to our RabbitMQ message broker instance. Ironbroker accepts payloads from a variety of sources, including GitHub and the learn-test gem. Any events that don't come from sources we recognize will not be processed. Those that are valid proceed to RabbitMQ.

Right now, we've been focusing on the journey of payloads from the learn-test gem. Those payloads correspond to the Local Build light. To make the Fork and Pull Request lights work, we've configured our applications to subscribe to GitHub webhooks, which is how we get notified about our students' forks and pull requests on their lesson repositories. Those webhooks are sent to Ironbroker as well and then processed. So you can imagine that Ironbroker is this service that accepts a bunch of data, figures out which events are relevant to Learn, and passes those messages (payloads) along over AMQP (Advanced Messaging Query Protocol) to RabbitMQ. From here forward, payloads for forks and submissions are handled nearly the same as local builds.

Explaining how RabbitMQ works is a bit outside the scope of this post, so for our purposes, it's important to note that our infrastructure makes use of topic exchanges and queues via a routing key. When Ironbroker communicates with RabbitMQ, it designates which topic to send data to and specifies the routing key so that messages accumulate in the right queue. We decided to use RabbitMQ to handle our payloads because it's a bit more reliable than just having our main Rails app listen for webhooks. When we were listening for payloads just over HTTP, we dropped some events and payloads, which, since the lights are so beloved to our students, was a problem.

Our payload generated from running `learn test` has now been transformed by Ironbroker and passed along to RabbitMQ where it is routed to the appropriate queue (Local Build). There it waits to be consumed (worked off the queue).
We have a number of worker boxes that run instances of our main Rails app that subscribe to the RabbitMQ queues and pull messages off queues to process them. We named these worker boxes "Ironworker," but they run the exact same code as our primary Rails codebase through the Sneakers framework. These worker boxes, however, don't listen for any HTTP traffic. They just exist to work messages off queues.

Each queue has a worker that pulls messages off it. Since we're focusing on the Local Build queue right now, we also have a `LocalBuildWorker` object whose job is to process the payload. In code, that amounts to:

```
class LocalBuildWorker < BaseWorker
  from_queue :local_builds,
  exchange: 'ironbroker.builds',
  exchange_type: :topic,
  routing_key: 'ironbroker.builds.*'

  def execute_service(message)
    LocalBuildSubmissionHandler.new(message).execute
  end
end
```

The `LocalBuildWorker` class takes the message off the queue and hands it off to the `LocalBuildSubmissionHandler`, a service object that augments the payload and then hands it off to the `SubmissionHandler` class. This class in our codebase handles the bulk of the processing. It records the submission and figures out how that submission relates to a progress record in our codebase. It also creates an activity feed event and publishes it to the activity feed on Learn.co, which you'll see in the sidebar of many of our dashboard and course pages. Finally, it converts that submission data into a payload for Pushstream. Pushstream, by the way, is an NGINX module that pushes JSON payloads to subscribers. The `SubmissionHandler`, via one more publication cycle to RabbitMQ, talks to our Pushstream server to handle flipping the light without a page refresh.

As I previously warned, a lot is happening in that `SubmissionHandler`. So just to recap, the `SubmissionHandler` records progress and then creates a new payload for Pushstream to consume. It publishes a message to the Pushstream queue on our RabbitMQ instance. A `PushstreamWorker` pulls off that message and communicates to the Pushstream server.

At this point, the payload generated from the original test submission has now been converted into something that Pushstream understands and can send back to the browser, which looks like this:
```
{
  submission_id: id,
  event: event,
  source: source,
  type: 'submission',
  build_type: build_type,
  assigned_repo_id: assigned_repo_id,
  assessment_id: assessment_id,
  lesson_id: lesson_id,
  passing: passing?,
  message: notification_message
}
```

## 5. Flipping the lights
Pushstream sends a message back to the browser over a stream to flip the color of the light on the front-end. It's a pub/sub model in which messages are published from the server and received by a subscriber on the client.

In code, here's what our current app for the lights looks like. It's written in Backbone / Marionette, but we plan to soon convert it to React. What's important to note is that we're establishing listeners for the Pushstream event.
```
var Assessment = BaseModel.extend({
  initialize: function() {
    currentUserSub.on('submission',this.onSubmission.bind(this))
  },

  onSubmission: function onSubmission (submissionData) {
    const passing = (submissionData.passing === 'true')
    const status = passing ? 'complete' : 'failing'
    this.set('status', status) // status changes the color
  }
)}
```

Each user on Learn gets a subscription to a channel for their user on Pushstream, and we have listeners waiting for messages from Pushstream on the front-end. When we receive a message from Pushstream for that user, we process it and figure out if the light should be passing or failing for an assessment on a lab. Once we change the status, our CSS will change the color accordingly, and the student will see instant feedback for their actions. In addition, we've persisted the progress, so when a user refreshes the page, the light will remain its new color.

## 6. Summary
And that's it! That's the whole journey of a payload on Learn, from test submission to light flipping. From a payload generated from the learn-test gem (or GitHub), we walked through Learn's internal message broker to RabbitMQ, to Ironworker, Pushstream, and finally, back to the browser. That whole journey happens every time a student runs their tests, forks a repository, or submits a pull request. It's kind of crazy, right? That's why I like to call this story "The Little Payload That Could."


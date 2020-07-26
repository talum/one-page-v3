---
layout: post
title: "Hints for Optimizing a SQL Query"
date: 2020-07-26T10:58:00-04:00
comments: true
categories: ["performance", "sql"]
---

A few weeks ago, I fielded a bug report about an API endpoint that was
timing out and showing a 500 error to a client. For one of our seller sites,
there just seemed to be too much data to return efficiently in one request.
The bug was affecting a handful of other sellers, but only this one was
consistently timing out.

Since diving more deeply into query optimization was new to me, I thought it
would be interesting and instructive to document my process.

## 1. Gather some metrics about the timeout

The first step was to replicate and understand the bug. We located the
endpoint and looked at its performance metrics in our tools -- New Relic for
APM, Datadog for additional logs, Honeybadger for exceptions.

Datadog and Honeybadger both reported timeout exceptions. Looking at the
transaction in New Relic, we viewed a flamegraph breakdown of
the entire request and identifed that the cause of the bottleneck was two
slow queries within the same request.

Two queries were each taking about 18 seconds to complete! Wild.

## 2. Read through the code and convert it to SQL

Our next step was to dive deeper into the code to understand where the two
queries were coming from. The code was pretty gnarly, part Active Record,
part parameterized SQL fragment, so we turned it into raw SQL using the
parameters for the most problematic request.

As part of investigating the code, we noticed that one query was required to
return the paginated event data for the request, but the other query was
returning a count of the total events.

Apparently, with the volume of data we had, the query to count the events
took just as long as the query to return the events themselves!


## 3. Run the SQL query planner against a production replica

Next, we attempted to optimize the query using the `EXPLAIN ANALYZE` command
from Postgres. For every query it gets, PostgreSQL devises a query plan to
get the data. Sometimes you can rearrange a query to help Postgres figure
out the best way to get the data.

So, that was our next step, getting the query plan. We generated it through
the PostgreSQL client, [Postico](https://eggerapps.at/postico/), which I
use to read from the databases in our various environments.

## 4. Visualize the bottlenecks
Once we had obtained the query plan, we used a query plan visualizer,
[Dalibo](https://dalibo.github.io/pev2/#/), to look at the actual query to
see which indexes Postgres was using and whether there was something we
could do to speed up the queries.

There were a ton of joins on massive tables and a lot of filters based on
date ranges, offsets, limits, and so on.

## 5. Experiment and evaluate the costs and benefits of each approach

With these tools, we continued experimenting with different approaches. By
cutting out some of the cruft in the `count` query, we were able to speed it
up by 44%, but that still wasn't enough to bring the entire request
consistently below our 29-second Rack timeout.

So instead, we ended up changing the interface of the API endpoint. It was a
private, undocumented endpoint used by an analytics provider, so we worked
closely with them to make the change.

The solution for this bug was to introduce an optional query parameter to
eliminate the count query. Rather than including the count and total pages
in our response, the client would hit the endpoint until it received an
empty result set. This allowed us to eliminate the `count` query entirely and
effectively cut the response time in half.

Now, our clients can get the data they need, which is pretty exciting.
And...this should buy us time for a while. In the future, more work may be
required to pre-process this data somewhere else.

## References
- [Using Explain](https://www.postgresql.org/docs/9.5/using-explain.html)
- [Reading an Explain Analyze Query Plan](https://thoughtbot.com/blog/reading-an-explain-analyze-query-plan)
- [Dalibo Query Plan Visualizer](https://dalibo.github.io/pev2/#/)



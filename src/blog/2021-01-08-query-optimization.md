---
layout: post
title: "Optimizing a Background Job"
date: 2021-01-08T18:05:00-05:00
comments: true
categories: ["query optimiztion"]
---

I know it seems like all I do is optimize queries, but I swear that's
not all that I've been up to. I did, however, recently take a background job
that could take up to 60 minutes down to 10 minutes!

So mostly I am just here to brag today.

It sounds bonkers, I know, but all it took was Datadog's APM tools and a new
database table index.

Here are the steps I took to solve it, for future me and for whomever else
stumbles upon this post.

# 1. Get metrics and understand the problem.

At first, I felt pretty stumped. New Relic showed a flamegraph and
breakdown for a sample of transactions, but it was hard to see where the
true bottleneck was. Then, a colleague showed me a similar graph in Datadog,
and my goodness, the issue became so clear.

I was able to sort the jobs by duration and inspect the exact pieces of the
most expensive background jobs. Suddenly I had insight into a
database query that appeared to be taking 45-58 minutes. I'm not even
kidding. When I saw that, I thought it was some kind of joke, but then I
looked at the query itself and the code that executed the query.

As it turns out, for certain clients, we were loading up
thousands of records to run some calculations. And we were batching the
retrieval, fetching 1000 records at a time.

For example, if a client had 90k records, we'd make 90 queries and each of
those queries could take around 30s...which would take 45 minutes.

YIKES.

# 2. Understand the query plan.

As I've written before, using the Postgres query planner is a logical
next step for fine-tuning queries. So I used `explain analyze` to figure out how Postgres was making
its plan.

For clients exceeding a threshold of 80k records or so, Postgres fell back
to the primary key index rather than using the compound index that another
developer had introduced in a previous attempt to solve this problem.

# 3. Experiment with indexes.

I dug further into the old PR that had attempted to address
this issue by introducing an index on multiple columns of our large table.
The comments had suggested that this was good enough for the time, and it
probably was. The index certainly reduced the time this background job was
taking.

But I figured I would...just check to see if we could do better, because why
not? I wasn't optimistic, but I had nothing to lose.

My hypothesis was that adding the primary key id to the index might make the
query planner more likely to use the index rather than fall back to the
primary key index (which ends up being a sequential scan).

The next problem, however, was to figure out how to make experimenting easy
and efficient. On local dev, we only have sample data, and it was hard to
replicate the issues of scale present in a production environment.

The next best thing was to tinker on a QA box. We happen to use Heroku, so I
opened up a psql console on Heroku and added an index through there instead
of through a migration. Gasp, I know, how could I?

But it was just a QA box and I was careful to remove my failed experiments.
It also would have been _so annoying_ to make a migration, commit the
migration, deploy it to QA, wait 10-20 minutes, run my tests, rollback the
migration, and do it again.

So QA box it was.

# 4. Ship that solution

I played around with my hypothesis that adding a new index on an additional
column would help, and to my surprise, it did! So I wrote a new migration to
do this the right way on prod, and shipped it.

# 5. Monitor the results

Afterward, I looked at Datadog again to gather some metrics, and thankfully,
it had worked! Jobs that had taken 60 minutes went down to 10. Jobs that had
taken 45 minutes, went down to 4 minutes!

It was amazing, and I just felt like I had to write about this win during
such a weird and unpredictable week.










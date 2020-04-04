---
layout: post
title: "How to Convince Yourself to Use TDD"
date: 2020-04-04T14:01:00-04:00
comments: true
categories: ["tdd", "test-driven development"]
---

There comes a time in every developer's career when they must ask themselves
if they want to write a test before they write the actual code.

That time came for me probably around two years ago, and now that I
(pretty) consistently practice test-driven development, or TDD, I've (almost) never looked back.

Prior to writing tests, as a new developer, I coded with abandon, furiously
typing and stuffing code into places it didn't really belong just to make a
feature work. I thought that tests held me back from making real progress.
They slowed me down and prevented me from shipping as fast as possible.

In reality, there existed the minor problem that I didn't
really know how to write tests, and learning an entirely new skill under a
tight deadline didn't seem feasible. So I didn't write tests for probably
the entire first year of my career as a professional developer. But had I
invested some time in learning testing, I would have saved myself a lot of
hassle and heartache.

Some people make the case that writing tests is a waste of time, and in some
startup environments, where cash is strapped and time is running out to
deliver a viable product, that may be true. The best-tested code that
doesn't deliver value is indeed useless to the business.

But for the rest of us, who work at slightly more stable companies with
growing businesses and feature sets, tests are actually an invaluable part
of the feature development cycle.

I can preach all day about the benefits of testing—how it documents working
code, how it communicates intent to your team, how it saves you from
yourself, how it allows you to refactor safely, how it sets juniors and seniors
apart—but you probably won't believe me until you experience
the magic of testing for yourself.

If you still need convincing that TDD, or really writing any tests, is
essential to your workflow, read on for tips on how to convince yourself to
practice TDD.


## Feel the pain

I'm not joking about this one. To see the benefits of testing, all you need
to do is step into a particularly gnarly codebase, change one line of
spaghetti code, then watch unexpected bugs appear from out of nowhere. To
truly understand why testing is beneficial, you do actually need to mess up
for yourself a few times. No amount of anyone preaching to you that "testing
is good" will convince you otherwise. And when you're tired of feeling the
pain, you'll be able to explore some solutions.

## Learn about testing and refactoring

I (unfortunately) am still no expert on testing, but I still get by with
TDD. A few books helped me
change my mind on the necessity of testing and specifically how writing
tests for how certain classes or components can allow you to refactor safely
your existing code. [99 Bottles](https://www.sandimetz.com/99bottles) by Sandi Metz
and Katrina Owen and [Working Effectively with Legacy Code](https://www.amazon.com/Working-Effectively-Legacy-Michael-Feathers/dp/0131177052) by Michael C. Feathers
are two books that I recommend to change your
mind. You can also learn about design patterns if you really want to take
your coding abilities to the next level.

## Continue working in an ever-changing codebase

Even intellectually understanding why testing is beneficial won't alone
change your mind about testing. As you continue to work in an ever-changing codebase, you may
come to realize that you're making a lot of changes and
praying. Hope does not inspire a lot of confidence in software
development.

And let's face it, writing code is hard enough. Reading other people's code
and trying to work with it is even harder. So do yourself a favor and write
some tests. This way, you can be more certain that the changes you make are
what you intended. Writing tests takes much of the guesswork out of your
changes, which saves you time and ultimately makes you more productive.

## Just add a test file

Take a baby step and just add a test file with a single simple test to get
yourself over the hump. For me at least, the greatest barrier to entry is
writing the first test (there's *so much setup*, *so much boilerplate*, I
think to myself). Once a test file is established and even a single test is
written, it becomes so much easier to build upon it. I usually write
something like "it returns true" just to warm up, and then just that act removes the
mental block I established, freeing me up to get into the more complex
parts of the business logic.

## Try writing descriptive tests first

If you aren't sure of the interface you want just yet, try writing
descriptive tests first. That is, write the code you want, then write the
test. Getting into the habit of writing a test is better than writing no
test at all. (Truthfully, I have never regretted writing a test, not even
once that I later deleted because I learned more about the expected behavior
and results.)

With descriptive tests, you might miss a couple edge cases, but hey, you do need a starting
point. Writing tests allows you to write garbage code first and later refactor, guaranteeing
that you don't change behavior while you're changing code. It's sort of like
writing an essay and just getting a bunch of brainstorming nonsense out before you edit.

## Refactor

Once you've written your tests, you can begin refactoring and see what pleasure the
ability to change code confidently brings. No more guessing. No more
praying. Just sweet peace of mind. Plus, with confidence comes saved dev
cycles.

## Start doing TDD

After you're used to writing tests, try writing them first, before you've written the code to make them pass.
I like to write out all the cases I know about
and then I build upon them as new ones are discovered or use cases change. Then I refactor to my heart's content, never straying too far into red and always committing on green.
Soon it will become habit and you'll feel gross *not* writing the tests
first. At least I do. I get nervous every time I write code without a
corresponding test, so I basically test everything I can within reason. I
typically stick to testing public-facing methods, but if I'm dealing with
time or money, two notorious sources of bugs, I'll even test private methods
to make sure I get the logic right. Tests have saved my life so many times
that I've actually lost count.

## Spread the word

After you've seen the magic of TDD, I bet you'll want to spread the word,
too. TDD is super fun, especially when combined with
ping-pong pairing. It documents your code, helps you organize, and also lets
you refactor until you're happy, which may or may not mean you've achieved
elegant code, but no matter—getting your code under test gives you the
ability to achieve elegance one day, and for now, practically speaking, that is probably good enough.



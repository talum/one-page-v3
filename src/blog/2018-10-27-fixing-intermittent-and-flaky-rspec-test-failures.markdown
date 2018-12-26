---
layout: post
title: "Fixing Random, Intermittent, and Flaky RSpec Test Failures"
date: 2018-10-27T11:54:04-04:00
comments: true
categories: ['ruby', 'rspec', 'testing']
---

In my view, there's almost nothing more annoying than a randomly failing, intermittent,
flaky test failure. Run the test suite locally and everything passes.
Run it on a CI service, and your build fails! A single red! 🔴 Rebuild it again, and somehow,
magically, it goes green.

A flaky or flickering test can create space for lots of noise and uncertainty. False negatives can delay
deploys and shipping features. 🚢 An expected red failure may encourage developers to ignore true
negatives and merge to master and deploy anyway.

Such was the general atmosphere on my team recently. Nondeterministic specs
kept cropping up every few builds, eventually creeping up to about 50% of
our builds on the master branch. And on a growing team, with looming launch
dates, no one felt empowered enough to solve the flaky test issue. After
all, hunting down a nondeterministic bug could take days, weeks, or more.

We kept saying we'd address it soon, but with our ops team working on a new
deployment strategy that relies on passing builds, we finally prioritized
it. And I was the lucky individual selected to track it down.

This is the story of how I resolved this particular set of flaky test failures.

## Unexpected Failures 😕
For the past few months, I've been making a lot of backend, systemic, and
wide-reaching changes to my team's codebase to support a migration to GitHub
Enterprise. And I mean the entire codebase,
from our main Rails monolith, to our open-source gems, to our IDE, and to our chat service.
That work warrants its own post, so for now, suffice it to say that our
platform is deeply integrated with GitHub, depending on it for everything
from avatars and usernames to hosting our lesson content.

Anyway, in order to decouple our platform from GitHub, my squad and I set
out to introduce the concept of a `LearnAccount` separate from a
`GithubAccount`, which keeps track of a Learn-specific identity and a
GitHub-specific identity, respectively.

Being the responsible team members we are, we replaced every method call
meticulously and backed up our changes with specs. For the new
`LearnAccount` model, which `belongs_to` a `User` model, we created a
factory using [Thoughtbot's Factory Bot](https://github.com/thoughtbot/factory_bot_rails). And we use the [Faker](https://github.com/stympy/faker) gem to create reasonably realistic and random test data to work with.

```ruby
FactoryBot.define do
  factory :learn_account, class: Identities::LearnAccount do
    username    { Faker::Lorem.word }
    user_id     1
  end
end
```

The new factory for the `GithubAccount` was essentially the same.

We also added a trait to our `Users` factory so that we could selectively create `learn_account`s for the `user`s we create in our tests.
We definitely didn't want to persist more records than necessary, which could slow down our test suite.

```ruby
FactoryBot.define do
  factory :user do
    email { Faker::Internet.email }
  end

  trait :with_learn_account do
    after(:create) do |user|
      user.create_learn_account
    end
  end
end
```

This all seemed fine. We launched the new feature, removed the old code, and then the test suite began to fail occasionally. The most common test failures would look something like this:

```ruby
1) Api::V1::UsersController Switch active batch or track POST #switch_active_track given track within students current active batch updates the current track
Failure/Error: learn_account.username
     NoMethodError:
       undefined method `username' for nil:NilClass
     # ./app/models/user.rb:185:in `learn_username'
```

```ruby
 1) Api::V1::StudyGroupsController PUT update rsvp_update rsvped returns a status 200
     Failure/Error: learn_account.username
     NoMethodError:
       undefined method `username' for nil:NilClass
     # ./app/models/user.rb:185:in `learn_username'
```

```ruby
 1) CoursesController GET courses/:course_slug/sign-up user has email in session user's email already exists in the db user has login credentials redirects user to sign in and stores slug in session
     Failure/Error: expect(session[:course_slug]).to eq(course_slug)
       expected: "batch-123"
            got: nil
```

It was often different tests from different domains in our codebase, but the error would always look similar to one of the above test failures.

## Reproducibility 🤷🏻‍
The first issue I encountered was trying to reproduce the failing specs. I kept re-running the specs locally, and they simply wouldn't fail. I did this over and over again, and began to fear for my sanity. And yet, on CircleCI, builds kept failing. I'd re-run those as well, and sometimes they'd fail, and sometimes they'd pass. I looked a bit into the various Circle configs, wondering if some misconfiguration was causing tests not to clean up after themselves. I also searched our local `rspec` configs just in case, but came up empty.

Then I scoured the other internet literature, looking for other strategies to solve flaky tests. Among the most helpful posts were the instructive ones on how to use RSpec's `bisect` flag. When used along with RSpec's `--seed` flag, the `bisect` option would "run subsets of your suite in order to isolate the minimal set of examples that reproduce the same failures," according to the [RSpec docs](https://relishapp.com/rspec/rspec-core/docs/command-line/bisect). This allows you to identify order-dependent test failures. Meanwhile, the `seed` option allows you to randomize the specs to run in the same order. You'll need to use both flags to make this work:

```ruby
rspec --seed 1234 --bisect
```

This wasn't the final solution, however. The first few times I ran this on a single test file, the failing tests would not make themselves known. I knew in my mind that if I could just get one to fail consistently, I'd solve the rest. But finally, I was able to reproduce the failing spec with the command above. And with that minimal reproduction command, I was able to get deterministic test runs and further isolate the problem.

## The Fix 🛠️
With reproducibility, I could look closer at the code and identify the issue. Because it wasn't the same test failing all the time, I realized that the problem wasn't with the tests themselves, _but with the data setup_. `Usernames` for our `LearnAccount`s and `GithubAccount`s must be unique, but our factories weren't always generating unique values, which resulted in the `LearnAccount` and `GithubAccount` associated with a `User` failing to be persisted in the database because they weren't valid. That explained why the `learn_account` and `github_account` was sometimes `nil`.

In fact, we were using the `Faker` gem to generate values that approximated real values, specifically `Faker::Lorem::Word`. There are only 249 values in that collection of words, so there is a non-trivial chance of collision. (I'm not great at probability, but I believe it boils down to the [problem of choosing the same number](https://math.stackexchange.com/questions/509679/probability-of-choosing-the-same-number)).

So, the fix was to ensure that the generated usernames in the tests would always be unique, and I did that by using [Factory Bot's Sequences](https://github.com/thoughtbot/factory_bot/blob/master/GETTING_STARTED.md) to append a unique integer to the end of a generated value.

Our factories now look like this:
```ruby
FactoryBot.define do
  factory :learn_account, class: Identities::LearnAccount do
    sequence :username do |n|
      "#{Faker::Lorem.word}-#{n}"
    end
    user_id     1
  end
end
```

I ran the test suite locally and on Circle a few dozen times more, all with passing builds, merged this change in, and celebrated by blocking all future merges to master without a passing test suite. Just kidding, I also alerted our team via Slack and scattered a bunch of fingers-crossed emojis everywhere. 🎉🤞🏼So far, so good. All greens ✅.

## Key Lessons Learned 🗝️
1. It's important to tackle random test failures the moment they're introduced.
2. RSpec `--seed` and `--bisect` can help you isolate the problem.
3. Sometimes it's not the test, but the data backing the test. i.e. Don't rely on `Faker` to generate unique values.

(Bonus Lesson) I'm getting way too into emojis. 🚀

## Resources
- [Eliminating Flaky Ruby Tests](https://engineering.gusto.com/eliminating-flaky-ruby-tests/)
- [A Better Way to Tame Your Randomly Failing Specs](https://sourcediving.com/a-better-way-to-tame-your-randomly-failing-specs-29040dc0ed24)
- [RSpec Bisect](https://relishapp.com/rspec/rspec-core/docs/command-line/bisect)
- [How RSpec helped me with resolving random spec failures](https://blog.arkency.com/2016/02/how-rspec-helped-me-with-resolving-random-spec-failures/)


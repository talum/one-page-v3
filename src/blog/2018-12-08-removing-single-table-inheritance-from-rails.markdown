---
layout: post
title: "Removing Single Table Inheritance from Rails"
date: 2018-12-08 19:26:16 -0500
comments: true
categories: ["rails"]
---

When [Learn](https://learn.co)'s main codebase came into existence five years ago, Single Table Inheritance (STI) was pretty popular. The Flatiron Labs team at the time went all in on it - using it for everything from assessments and curriculum to activity feed events and content within our growing learning management system. And that was great- it got the job done. It allowed instructors to deliver curriculum, track student progress, and create an engaging user experience.

But as many blog posts have pointed out ([this one](https://medium.com/r/?url=https%3A%2F%2Fmedium.freecodecamp.org%2Fsingle-table-inheritance-vs-polymorphic-associations-in-rails-af3a07a204f2), [this one](https://medium.com/@dcordz/single-table-inheritance-using-rails-5-02-6738bdd5101a), and [this one](https://medium.com/r/?url=https%3A%2F%2Fabout.futurelearn.com%2Fblog%2Frefactoring-rails-sti) for example), STI does not scale super well, especially as the data grow and new subclasses begin varying widely from their superclasses and each other. As you might have guessed, the same happened in our codebase! Our school expanded and we supported more and more features and lesson types. Over time, the models began to bloat and mutate and no longer reflect the right abstraction for the domain.

We lived in that space for a while, giving that code a wide berth, and patching it only when necessary. And then the time came to refactor.

Over the past few months, I embarked on a mission to remove one particularly gnarly instance of STI, one that involved the somewhat ambiguously named `Content` model. As easy as STI is to set up initially, it's actually pretty difficult to remove.

So, in this post, I'll cover a bit about STI, provide some context about our domain, outline the scope of work, and discuss strategies I employed to safely deploy changes while minimizing the surface area for serious damage while I gutted the core of our app.

## About Single Table Inheritance (STI)
In brief, Single Table Inheritance in Rails allows you to store multiple types of classes in the same table. In Active Record, the class name is stored as the type in the table. For example, you might have a `Lab`, `Readme`, and `Project` all live in the `contents` table:

```ruby
class Lab < Content; end
class Readme < Content; end
class Project < Content; end
```

In this example, labs, readmes, and projects are all types of content that could be associated with a lesson.

Our `contents` table's schema looked a bit like this, so you can see that the type is just stored in the table.

```
create_table "content", force: :cascade do |t|
  t.integer "curriculum_id",
  t.string  "type",
  t.text    "markdown_format",
  t.string  "title",
  t.integer "track_id",
  t.integer "github_repository_id"
end
```

## Identifying the Scope of Work
`Content` sprawled throughout the app, sometimes confusingly. For example, this described the relationships in the `Lesson` model.

```ruby
class Lesson < Curriculum
  has_many :contents, -> { order(ordinal: :asc) }
  has_one  :content, foreign_key: :curriculum_id
  has_many :readmes, foreign_key: :curriculum_id
  has_one  :lab, foreign_key: :curriculum_id
  has_one  :readme, foreign_key: :curriculum_id
  has_many :assigned_repos, through: :contents
end
```

Confused? So was I. And that was just one model of many that I had to change.

So with my brilliant and talented teammates (Kate Travers, Steven Nunez, and Spencer Rogers), I brainstormed a better design to help cut down on confusion and make this system easier to extend.

## A New Design
The concept that `Content` was trying to represent was an intermediary between a `GithubRepository` and a `Lesson`.

Each piece of "canonical" lesson content is linked to a repository on GitHub. When lessons are published or "deployed" to students, we make a copy of that GitHub repository and give students a link to it. The link between a lesson and the deployed version is called an `AssignedRepo`. 

![New Curriculum Model](https://s3-us-west-2.amazonaws.com/talum.github.io/content-diagram.png)

So there are GitHub repositories on both ends of lessons: the canonical version and the deployed version.

```ruby
class Content < ActiveRecord::Base
  belongs_to: :lesson, foreign_key: :curriculum_id
  belongs_to: :github_repository
end

class AssignedRepo < ActiveRecord::Base
  belongs_to :content
  belongs_to :readme
  belongs_to :lab
  belongs_to :project
end
```
At one point, lessons were able to have multiple pieces of content, but in our current world, that is no longer the case. Instead, there are various kinds of lessons, which can introspect on themselves by looking at the files included in their associated repositories.

So, what we decided to do was replace `Content` with a new concept called `CanonicalMaterial`, and give the `AssignedRepo` a direct reference to its associated lesson instead of going through `Content`.

If that sounds confusing and like a lot of work, it's because it is. The key takeaway though is that we had to replace a model in a pretty big codebase, and ended up changing somewhere in the realm of 6000 lines of code.

## Strategies for Refactoring and Replacing STI
### The New Model
First, we created a new table called `canonical_materials` and created the new model and associations.

```ruby
class CanonicalMaterial < ActiveRecord::Base
  belongs_to :github_repository
  has_many :lessons
end
```

We also added a foreign key of `canonical_material_id` to the `curriculums` table, so that a `Lesson` could maintain a reference to it.

To the `assigned_repos` table, we added a `lesson_id` column. 

### Dual Writes
After the new tables and columns were in place, we started writing to the old tables and the new ones simultaneously so that we wouldn't need to run a backfill task more than once. Any time something tried to create or update a `content` row, we'd also create or update a `canonical_material`.
For example:

```ruby
lesson.build_content(
  'repo_name' => repo.name,
  'github_repository_id' => repo_id,
  'markdown_format' => repo.readme
)

lesson.canonical_material = repo.canonical_material
lesson.save
```

This allowed us to lay the groundwork for ultimately removing `Content`.

### Backfilling
The next step in the process was to backfill the data. We wrote rake tasks to populate our tables and ensure that a `CanonicalMaterial` existed for each `GithubRepository` and that each `Lesson` had a `CanonicalMaterial`. And then we ran the tasks on our production server.

In this round of refactoring, we preferred having valid data so we could make a clean break with the legacy way of doing things. Another viable option, however, is to write code that still supports older models. In our experience, it's been more confusing and costly to maintain code that supports legacy thinking than it has been to backfill and make sure the data is valid.

In our experience, it's been more confusing and costly to maintain code that supports legacy thinking than it has been to backfill and make sure the data is valid.

### Replacement
And then the fun part began. In order to make the replacement as safe as possible, we used feature flags to ship dark code in smaller PRs, which enabled us to create a faster feedback loop and know sooner if things were breaking. We used the rollout gem, which we also use for standard feature development, to do this.

#### What to Search For
One of the hardest parts of doing the replacement was the sheer number of things to search for. The word "content" is unfortunately super generic, so it was impossible to do a simple, global search and replace, so I tended to do a more scoped search trying to account for the variations.

When removing STI, these are the things you should search for:

- The singular and plural forms of the model, including all of its subclasses, methods, utility methods, associations and queries.
- Hardcoded SQL queries
- Controllers
- Serializers
- Views

For example, forcontent, that meant looking for:
- `:content` - for associations and queries
- `:contents` - for associations and queries
- `.joins(:contents)` - for join queries, which should be caught by the previous search
- `.includes(:contents)` - for eager loading second-order associations, which should also be caught by the previous search
- `content:` - for  nested queries
- `contents:` - again, more nested queries
- `content_id` -for queries directly by id
- `.content` - method calls
- `.contents` - collection method calls
- `.build_content` - utility method added by the `has_one` and `belongs_to` association
- `.create_content` - utility method added by the `has_one` and `belongs_to` association
- `.content_ids` - utility method added by the `has_many` association
- `Content` - the class name itself
- `contents` - the plain string for any hardcoded references or SQL queries

I believe that is a pretty comprehensive list for content. And then I did the same for `lab`, `readme`, and `project`. You can see that because Rails is so flexible and adds many utility methods, it's hard to find all of the places that a model ends up being used.

### How to Actually Replace the Implementation After You've Found All the Callers
Once you've actually located all the call sites of the model you're trying to replace or remove, you get to rewrite things. In general, the process we followed was
1. Replace the method behavior in the definition or change the method at the call site
2. Write new methods and call them behind a feature flag at the call site
3. Break dependencies on associations with methods
4. Raise errors behind a feature flag if you're unsure about a method
5. Swap in objects that have the same interface

Here are examples of each strategy.

**1a. Replace the method behavior or query**
Some of the replacements are pretty straightforward. You put the feature flag in place to say "call this code instead of this other code when this flag is on."

<script src="https://gist.github.com/talum/3ddd742ba8259655b83a9af819d5d696.js"></script>

So instead of querying based on contents, here we query based on `canonical_material`.

**1b. Change the method at the call site**
Sometimes, it's easier to replace the method at the call site to standardize the methods called. (You should run your test suite and/or write tests when you do this.) Doing so can open up the path to further refactoring.

<script src="https://gist.github.com/talum/7d45d401e93c058a21612a10890e5c9d.js"></script>

This example demonstrates how to break the dependency on the `canonical_id` column, which will soon no longer exist. Notice that we replaced the method at the call site without putting that behind a feature flag. In doing this refactoring, we noticed that we plucked the `canonical_id` in more than one place, so we wrapped up the logic to do that in another method that we could chain onto other queries. The method at the call site was changed, but the behavior didn't change until the feature flag was turned on.

**2. Write new methods and call them behind a feature flag at the call site**
This strategy is related to the method replacement, only in this one, we write a new method and call it behind a feature flag at the call site. It was especially useful for a method that was only called in one place. It also enabled us to give the method a better signature- always useful.

<script src="https://gist.github.com/talum/09624fdbfdb3705c5f1f1a863cf461a2.js"></script>


**3. Break dependencies on associations with methods**

In this next example, a track `has_many` labs. Because we know that the `has_many` association adds utility methods, we replaced the one most commonly called and removed the `has_many :labs` line. This method conforms to the same interface, so anything that was calling the method before the feature was turned on would continue to work.

<script src="https://gist.github.com/talum/15cb9886eeac36fcc8e6a63a3781ee42.js"></script>

**4. Raise errors behind a feature flag if you're unsure about a method**
There were some times that we weren't sure whether we missed a call site. So, instead of just hard removing methods at first, we intentionally raised errors so we could catch them during the manual testing phase. This gave us a better way to track down where a method was being called.

<script src="https://gist.github.com/talum/087ba1606ea428a46c7c19ce5d7f3c01.js"></script>

**5. Swap in objects that have the same interface**

Because we wanted to get rid of the lab association, we rewrote the implementation of the `lab?` method. Instead of checking for the presence of a `lab` record, we swapped in the `canonical_material`, delegated the call, and made that object respond to the same method.

<script src="https://gist.github.com/talum/94cb3083d370d5f32ed964eec06a094f.js"></script>

These were the most helpful strategies for breaking dependencies and swapping in new objects throughout our Rails monolith. After reviewing the hundreds of definitions and call sites, we replaced or rewrote them one by one. It's a tedious process that I don't wish on anyone, but it was ultimately extremely helpful for making our codebase more legible and for removing old code that was sitting around doing nothing. It took several frustrating and hair-pulling weeks to get to the end, but once we had replaced the majority of the references, we began to do manual testing.

### Testing & Manual Testing
Because the changes affected features across the entire codebase, some of which weren't under test, it was hard to QA with certainty, but we did our best. We performed manual testing on our QA server, which caught a lot of bugs and edge cases. And then we went ahead and for more critical paths, wrote new tests.

### Roll Out, Go Live, & Clean Up
After passing QA, we flipped our feature flag on and let the system settle. After we were sure it was stable, we removed the feature flags and old code paths from the codebase. This, sadly, was harder than expected because it entailed rewriting a lot of the test suite, mostly factories which implicitly relied on the Content model. In retrospect, what we could have done was write two sets of tests while we were refactoring, one for the current code and one for the code behind a feature flag.

As a final step, which is still to come, we should back up data and drop our unused tables.

And that, friends, is one way you get rid of sprawling Single Table Inheritance in your Rails monolith. Perhaps this case study will help you too.

### Resources and Additional Reading
- [Rails Guides Inheritance](https://medium.com/r/?url=https%3A%2F%2Fapi.rubyonrails.org%2Fclasses%2FActiveRecord%2FInheritance.html) 
- [How and When to Use Single Table Inheritance in Rails by Eugene Wang (Flatiron Grad!)](http://eewang.github.io/blog/2013/03/12/how-and-when-to-use-single-table-inheritance-in-rails/)
- [Refactoring Our Rails App Out of Single-Table Inheritance](https://about.futurelearn.com/blog/refactoring-rails-sti)
- [Single Table Inheritance vs. Polymorphic Associations in Rails](https://medium.freecodecamp.org/single-table-inheritance-vs-polymorphic-associations-in-rails-af3a07a204f2)
- [Single Table Inheritance Using Rails 5.02](https://medium.com/@dcordz/single-table-inheritance-using-rails-5-02-6738bdd5101a)

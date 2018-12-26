---
layout: post
title: "How Refactoring Helped Me Give Learn.co's Lesson Page a Crazy Performance Boost"
date: 2018-07-01T14:07:10-04:00
comments: true
categories: ["performance", "sql"]
---

![Learn Lesson Page](https://s3-us-west-2.amazonaws.com/talum.github.io/learn-lesson.png)

## Learn.co's Lesson Pages
The lesson pages on Learn.co are the most important pages of the app. They are the portals for students to gain access to content and do work, whether through our in-browser IDE, our downloadable client packaged with Atom, or on a local environment. And yet, the lesson pages were also some of the slowest pages thanks to that bar showing other students who are either working on or have completed the lesson.

Over time, as more and more students have joined the platform and progressed through lessons, the lesson pages, especially those in the earliest part of our introductory tracks, began to slow down. This problem was only exacerbated as we opened up the flood gates through heavy marketing and by reducing early barriers of entry to our platform, such as requiring users to first sign up with a GitHub account and then connect it to Learn. There were tens of thousands of students who had completed those early lessons, and as more people joined, lesson page load times only worsened.

Noticing that lesson page load times had increased, about a year ago, a team tried to optimize the page by using caching, specifically fragment caching through [Rails](http://guides.rubyonrails.org/caching_with_rails.html) that happened to be configured to use [dalli](https://github.com/petergoldstein/dalli), a Ruby client for memcached. This resulted in a marginal speed improvement, but still left us with a pretty slow lesson page. Slow page loads are especially not great in our early intro tracks because they are the first pages that users signing up for Learn.co will see. As a person who has tested the onboarding flow on numerous occasions, I can attest that it was frustrating and confusing to click on the "Next Lesson" button and not have it update for up to half a minute.


## Refactoring

Recently, I've been working on migrating a few critical columns from our `users` table to an `integrated_accounts` table. In doing so, I had to rewrite a bunch of queries used in serializers to eager load data a prevent n+1 calls. While testing on these very large introductory tracks, however, I noticed that the pages took a truly ridiculous time to load. Even after eager loading associated data, the time it took to load the next lesson peaked at 28 seconds.

So, I decided to take a closer look and found that the problem wasn't so much the query to get the students as it was how we were serializing all the students from our API and sending them to the front-end, only to have them selectively filtered there. I'll be clear that this refactor resulted directly from trying to improve the performance of my query. It was that and only that that made this the right time to do a refactor.

## The Code

The lesson pages are an interesting blend of server- and client-side code. The first page load is rendered server-side through Rails, and then once the JavaScripts load, the front-end Backbone/Marionette takes data from a global store and hydrates itself to render a more complex view.

Structurally, we have an API endpoint that accepts params, uses those params to fetch data, and then serializes them to JSON format to return to the front-end. In code, there's a `UserCurrentLessonSerializer` that transforms the data. To better organize some of our data, we embed a presenter called the `BatchLessonProgressPresenter`, which is responsible for getting the data for the students working and students completed part of the page.

That presenter is where we'll spend the bulk of this post.

Initially, the `BatchLessonProgressPresenter` looked something like this:

```ruby
class BatchLessonProgressPresenter
  MAX_STUDENTS_DISPLAYED = 6

  def initialize(batch, lesson)
    canonical_id = lesson.canonical_id
    # Upon initialization, get all the students

    @started_students =
      User.authenticated.joins(:canonical_progresses)
        .merge(CanonicalProgress.working)
        .where(
          active_batch_id: batch.id,
          canonical_progresses: { github_repository_id: canonical_id }
        )

    @completed_students =
      User.authenticated.joins(:canonical_progresses)
        .merge(CanonicalProgress.complete)
        .where(
          active_batch_id: batch.id,
          canonical_progresses: { github_repository_id: canonical_id }
        )

    @students_at_work_count = @started_students.count
    @students_completed_count = @completed_students.count
  end

  def max_students_displayed
    MAX_STUDENTS_DISPLAYED
  end

  def started_students
    @started_students || []
  end

  def completed_students
    @completed_students || []
  end

  def students_at_work_count
    @students_at_work_count || 0
  end

  def students_completed_count
    @students_completed_count || 0
  end
end

```
Meanwhile, the `UserCurrentLessonSerializer` and a server-side template would call any of the other methods defined. The code here is fairly straightforward and easy to understand, but unfortunately, it is not performant at scale. If we look at `students_in_progress` and `students_completed`, you can see that we're actually just mapping over potentially tens of thousands of students in memory and serializing them. We're not even iterating over them in batches. That's where the bulk of the problem was.

```ruby
class UserCurrentLessonSerializer < LessonSerializer
  def batch_lesson_progress_presenter
    return unless batch
    @batch_lesson_progress_presenter ||= Rails.cache.fetch("#{batch_lesson_progress_cache_key(object.track_id, batch.id, object.github_repo_id)}") do
      BatchLessonProgressPresenter.new(batch, object)
    end
  end

  def students_in_progress
    return unless batch_lesson_progress_presenter
    batch_lesson_progress_presenter.started_students.map{|s| LessonUserSerializer.new(s, root: false)}
  end

  def students_completed
    return unless batch_lesson_progress_presenter
    batch_lesson_progress_presenter.completed_students.map{|s| LessonUserSerializer.new(s, root: false)}
  end
end
```

What was more interesting to me was how the students are actually displayed on the front-end. The maximum number of students we ever display is 6, and yet we map over all of them in order to get attributes such as their photo and name. We also want to be able to display the total count, which is probably my best guess at why we were serializing literally every student who had ever done the lesson or was working on it.

The crazy thing is that we were sending all the students to the Backbone/Marionette app just to have them treated as a whole collection.

```javascript
// readme/index.js

  readmeView: function readmeView (lesson) {
    var students = lesson.studentsInProgress().length > 0
                 ? lesson.studentsInProgress()
                 : lesson.studentsCompleted()
                 ;

		// Decide which collection to show
    // Then create a new collection with just 6 of them!
    // I'll admit I don't really know what this VirtualCollection business does
    // But I do know we definitely don't need all these students
    var filteredStudents = new VirtualCollection(students, {
      filter: function studentsFilter (student) {
        return student.collection.indexOf(student) < 6;
      }
    });
    return new ReadmeView({model: lesson, collection: filteredStudents});
  }

```

```javascript
// readme/readme_view.js
  studentsCount: function studentsCount () {
    // This returns the original length of the collection, the unfiltered version
    return this.collection.collection.length;
  },

  studentsHeader: function studentsHeader () {
    var noun = this.studentsCount() === 1 ? 'Student' : 'Students';
    var action = this.studentsState() == 'complete' ? 'Completed' : 'Working';
    return this.studentsCount() + ' ' + noun + ' ' + action;
  },

  studentsState: function studentsState () {
    return this.collection.collection.state();
  }

```

Yep, so I thought to myself, why don't we not serialize all the students and see if we can get the count of students in a slightly more clever way?

First, I started refactoring the `BatchLessonProgressPresenter` and wrote some tests. I ended up with this.

```ruby
class BatchLessonProgressPresenter
  MAX_STUDENTS_DISPLAYED = 6

  attr_reader :canonical_id, :batch, :lesson

  def initialize(batch, lesson, started_students_collection: nil, completed_students_collection: nil)
    # I enabled the ability to pass in a collection to facilitate testing, but they default to nil
    # I also wanted to delay the database calls because objects should remain cheap

    @batch = batch
    @lesson = lesson
    @canonical_id = lesson.canonical_id
    @all_started_students = started_students_collection
    @all_completed_students = completed_students_collection
  end

  def max_students_displayed
    # I kept this because a server-side template needs it
    MAX_STUDENTS_DISPLAYED
  end

  def started_students
    # Here, instead of returning all the students, I just return the first 6
    # I intentionally used `first` instead of `limit` because arrays do not respond to `limit`
    # The collection passed in can either be an array or an ActiveRecord::Relation
    all_started_students.first(max_students_displayed)
  end

  def completed_students
    # I did the same thing with completed_students
    # The name remains the same to preserve the interface
    all_completed_students.first(max_students_displayed)
  end

  def students_at_work_count
    # Now, instead of relying on the client to do the count, I just send it back here.
    all_started_students.count
  end

  def students_completed_count
    # Same
    all_completed_students.count
  end

  private

  def all_completed_students
    @all_completed_students ||=
      User.authenticated.joins(:canonical_progresses)
        .includes(:github_account)
        .merge(CanonicalProgress.complete)
        .where(
          active_batch_id: batch.id,
          canonical_progresses: { github_repository_id: canonical_id }
        )
  end

  def all_started_students
    @all_started_students ||=
      User.authenticated.joins(:canonical_progresses)
        .includes(:github_account)
        .merge(CanonicalProgress.working)
        .where(
          active_batch_id: batch.id,
          canonical_progresses: { github_repository_id: canonical_id }
        )
  end

end

```

This way, only 6 students for each collection are serialized. Next, I updated some of the client code.

```javascript
  // Instead of using .length, I render the count sent from the server
  studentsCount: function studentsCount () {
    if (this.studentsStateComplete()) {
      return this.model.get('students_completed_count')
    } else {
      return this.model.get('students_at_work_count')
    }
  },

```

And that describes the bulk of the changes. By rearranging the query and limiting how many students get serialized on every request, the average lesson page load time (for requests and downloads) went from about 20 seconds on average, to under 2. And that's by removing the caching mechanism. Overall, I find the code a little cleaner, a little smarter, and way way faster. There could likely be a few additional optimizations and some more cleanup, but this chunk of work was valuable enough to ship as is.




---
layout: post
title: "Configuring Courses with YAML"
date: 2018-04-07T12:11:24-04:00
comments: true
categories: "configuration"
---

I've done a lot of onboarding sprints during my time building Learn.co. It
seems like no matter what you build, you'll always need to iterate on the
best way for users to join your platform.

On Learn.co, we've gone through a number of phases.
1. **GitHub Oauth** Require GitHub Oauth to join the platform. There was no other way to sign
up aside from with GitHub.
2. **Superfast** Allow a password-less sign up. Users would sign up from a
marketing website and then get dropped into a Welcome track on Learn. This
meant that throughout that track, they would be prompted to create a
password to confirm their account, download our IDE, and then proceed into
their intended track. In their intended track, they would be prompted to
connect their account with GitHub via oauth.
3. **Streamlined** In this version, users were dropped right into their
intended track and would be prompted by a series of modals to create a
password and connect their GitHub account.

For our next iteration, we are exploring signing up with an email and a
password, which is what I'm currently working on for our newly announced
data science course.

For my latest feature work, I'm building out a way for users to join a
course with a skinned sign-up page. In the past, I've mapped an idea of a
"program of interest" to a course in code. This essentially was just a hash in code, `{ 'bootcamp-prep' => Cohort.find_by(name: 'bootcamp-prep'}`. If you had a certain program of interest, we would direct you to a specific path to join a course. We could have stored that program of interest in the database, but it actually felt like overkill -- it wasn't really the cohort's responsibility to know which program of interest corresponded to it. Cohorts are just groups of people. They shouldn't know about this external concept. So, in the meantime, we adopted a hash, which is fine when you don't need to update your courses that often.

Having a hardcoded hash, though, becomes problematic when you need to launch
a number of courses. Every time we launched a new course, we had to update
this hash, create a new route, and a new controller action. It became too
much.

So, what we've come up with is storing configurations in YAML. YAML is great
for storing configs because it's human-readable and easily updatable. It's
  especially useful for creating objects you want to interact with, but
  aren't sure if you really need a database-backed model for.

A config for a new course looks something like this:

```yaml
# config/courses.yml

bootcamp_prep:
  id: bootcamp_prep
  poi: bootcamp_prep
  slug: bootcamp-prep
  cohort_id: 12345
  display_name: Bootcamp Prep
  background_image: "/assets/backgrounds/bootcamp-prep.png"
```
As you can see, I'm specifying all the details that make this course unique
here. Now, I'm going to take this config file and turn it into a model object I
can use in controllers and views by using an `OpenStruct`.

For anyone who doesn't know, an
[`OpenStruct`](https://ruby-doc.org/stdlib-2.0.0/libdoc/ostruct/rdoc/OpenStruct.html) is just a cheap object. It accepts a hash on initialization and makes the resulting data structure respond to dot notation to access the attributes.

Here's an example:

```ruby
book = { title: 'The House of the Spirits', author: 'Isabel Allende' }
book_struct = OpenStruct.new(book)
book_struct.title
# => "The House of the Spirits"
```

Knowing this, we can also inherit from an `OpenStruct` and define our own
behaviors. In order to write `find_by` methods, it's actually necessary to
instantiate structs for each entry in the YAML file.

We do that by reading the file, iterating over the entries, and then
instantiating the struct. Below, you'll see that `self.all` is essentially
calling the `build_courses` private method to do just that. Read through the
comments inline for a step-by-step breakdown. Using structs allows me to
avoid the annoyance of defining my own attr_readers for every property.

```ruby
require 'ostruct'

class Course < OpenStruct
  def self.all
    @courses ||= build_courses
  end

  def self.build_courses
    # Now, we iterate through all of the ids to get the corresponding
    # course hash and turn that into a new instance of a `Course`, which
    # inherits from `OpenStruct`
    # This new course "object" will respond to dot notation for the
    # attributes defined.

    course_ids.map do |course_id|
      course_hash = course_configs.fetch(course_id)
      new(course_hash)
    end
  end

  def self.course_configs
    # This is how we read the file as YAML.
    YAML.load(File.read('config/education_courses.yml'))
  end

  def self.course_ids
    # Here we are grabbing the top-level keys, one for each entry
    course_ids = course_configs.keys
  end

  private_class_method :course_configs, :build_courses
  # I've made these private so they aren't called outside of this class.
end

```

So far, we've built out a collection of structs that behave like regular old
objects. Now, we can define behavior for the `Course` class. We can define
behaviors just like in any other class.

So first, I'll build out some `find_by` methods to make look-up easier.

```ruby
class Course < OpenStruct
  # omitted code

  def self.find_by_slug(slug)
    self.all.find(null_course) {|c| c.slug == slug }
  end

  def self.find_by_poi(poi)
    self.all.find(null_course) {|c| c.poi == poi }
  end

  def self.null_course
    Proc.new { self.new({id: 'null-course'}) }
  end

# omitted code
end
```

Now, we have two finder methods that help us locate the course we want.
These methods just iterate through all of the courses we built previously in
the `build_courses` method and return the first one that matches. You'll
also notice that I'm passing an argument to the Ruby `find` method. This is
because
[`find`](https://ruby-doc.org/core-2.2.3/Enumerable.html#method-i-find) calls
whatever it in that block and returns that if specified, instead of nil.
This design follows the idea of a `null object`, which is often easier to
work with than a nil value.

The `null_course` method is a Proc that, when called, returns a new,
stripped-down instance of `Course`.

Great, we are well on our way! Now, I'll accomplish the mapping that our
other hash originally performed by writing a `cohort` method.

```ruby
class Course < OpenStruct
  # omitted code

  def course
    Course.find(id: course_id)
  end

  # omitted code
```

Now, if we created a courses controller, generating the correct landing page
is as simple as this.


```ruby
class CoursesController < ApplicationController

  def show
    @course = Course.find_by_slug(params[:slug])
  end
end
```

The corresponding view references that course to generate a background and
set some attributes for our nifty JavaScript app.

```slim
= content_for(:title, "Learn - Sign up for #{@course.display_name}")

.section style="background-image:url(#{@course.background_image});"
  #js--course-sign-up-modal data-course-slug="#{@course.slug}" data-course-title="#{@course.display_name}"
```

Cool, so that's essentially how we use YAML to create really useful objects
to work with in our codebase. Now, setting up a new course is as
easy as adding some YAML to our config file, and everything should just
work!


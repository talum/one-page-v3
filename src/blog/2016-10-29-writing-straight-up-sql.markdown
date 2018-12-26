---
layout: post
title: "Writing Straight Up SQL"
date: 2016-10-29T09:58:14-04:00
comments: true
categories: 
---

As much as I enjoy Active Record as an ORM (Object Relational Mapping) Framework, it's sometimes necessary and easier to write your own SQL.

Object Relational Mapping may sound fancy and complicated, but all it really
does is create a mapping between the objects in an an application to tables
in a relational database. In the Rails framework, Active Record is a gem
that handles all of the associations, validations, and database operations
for us. It abstracts away the necessity of programmers needing to write SQL
  statements directly, which is important because not all database vendors
  implement SQL the same way. There are minor variations, so if you needed
  to swap database vendors quickly and weren't using Active Record to
  abstract away the SQL, you could wind up in a minor nightmare. Also,
  writing straight SQL for every create or update could quicky get boring. A
  lot of it becomes boilerplate when you're working with a ton of models and
  data, which is why something like `Student.create`
  or `@student.update(grade: 'A')` feels way nicer than "INSERT blah blah blah
  INTO students". 

That said, for some tasks, like creating complex data structures for a view that
relies on a number of tables, it is more efficient to write the SQL
yourself.

## Use Case for Your Own SQL
Recently I needed to write my own SQL to present derived student statistics
in a coherent fashion. Had the data been all in one place, this would have
been simple, but since the data I wanted to gather was distributed across 6 (possibly more? I lost count)
tables, 
it wouldn't necessarily make sense to write all the wonky associations
on the models for Active Record to manage the query for me. In addition,
since I was intimately acquainted with how the derived data was connected,
it made sense for me to do my own joins and selects. (Aside: I also spent a
few weeks writing straight SQL with Periscope, the data visualization tool,
so I was pretty pumped to do the same in Rails.)

<!-- more --> 

## How to Write SQL with Rails
Here's the huge and modified SQL statement I ended up writing, with table names and some associations changed. The point here isn't to demonstrate the workings of SQL but simply to illustrate that the data I wanted was not easily gatherable by normal associations. 
``` sql
    sql = <<-SQL
      SELECT
        app.time_taken_percentile,
        app.lesson_id,
        upp.time_to_complete_percentile_std_dev_1,
        app.user_id,
        users.first_name,
        users.last_name,
        users.github_username,
        users.email,
        lessons.id,
        lessons.title,
        progresses.updated_at,
        progresses.completed_at,
        reviews.canonical_id,
        reviews.review_completed_at
      FROM app AS app
      JOIN upp AS upp
      ON app.user_id = upp.user_id
      JOIN users ON upp.user_id = users.id
      JOIN lessons ON app.lesson_id = lessons.id
      JOIN progresses on app.canonical_github_repository_id = progresses.github_repository_id AND users.id = progresses.user_id
      JOIN (
        SELECT DISTINCT ON (submitter_id)
          submitter_id, projects.created_at, assignment_id, canonical_id, projects.completed_at as review_completed_at
        FROM projects
        JOIN assignments
        ON assignments.id = projects.assignment_id
        WHERE assignments.canonical_id IN #{formatted_for_sql_query(repositories)}
        ORDER BY submitter_id, projects.created_at DESC, assignment_id, canonical_id, projects.completed_at
      ) reviews
      ON users.id = reviews.submitter_id
      WHERE app.time_taken_percentile > upp.time_to_complete_percentile_std_dev_1
      AND users.id IN #{formatted_for_sql_query(students)}
      AND progresses.updated_at BETWEEN '#{start_date.to_date}' AND '#{end_date.to_date}'
      ORDER BY users.id ASC
    SQL
```
This is simply a SQL statement represented as a very long string that utilizes Ruby's [heredoc](https://en.wikibooks.org/wiki/Ruby_Programming/Here_documents). You can tell it's a heredoc since it's denoted by the ```<--```.

Now, in order to get the data, you just need to tell ActiveRecord to get some data for you.

That's accomplished by using `ActiveRecord::Base.connection.execute(sql)` where the sql is the sql statement above. [More info](http://api.rubyonrails.org/classes/ActiveRecord/ConnectionAdapters/DatabaseStatements.html#method-i-execute).

This will return the raw result of the query, which in this case is rows of data, sometimes called 'tuples' in the abstract. Now you can iterate over the tuples and format the data how you'd like. I ended up creating a hash structure to format my data, which I then returned to the view. 

If you're just starting out, it might be more difficult to wrap your head around what's happening here, so just know that a) Active Record abstracts away a lot of the database operations for us and b) it's possible to write your own SQL to get the data you want.

## Resources
- [ActiveRecord Basics](http://guides.rubyonrails.org/active_record_basics.html)

---
layout: post
title: "How to Write a Rake Task"
date: 2016-12-27 16:43:51 -0500 
comments: true
categories: 
---

Since I switched to Jekyll, I lost out on the nice Rake tasks that Octopress
provided. That's okay though. I thought this would be a good opportunity to
actually write a Rake task for myself.

# What's a Rake task? 

Rake is Ruby's version of make files (r + make = Rake, get it?). A Rakefile
just includes executable Ruby code, so you can encapsulate tasks that you
end up using a lot. You could also hook up Rake with a task runner in order
to run processes on a schedule.

But let's not get ahead of ourselves. 

Since I end up having to copy and paste a lot of the same boilerplate when
writing a new post, wrapping that procedure into a Rake task sounds like a
great idea.

# Rake setup

It's pretty easy to set up a Rake task for your app. Just consult the
[documentation](http://rake.rubyforge.org/doc/rakefile_rdoc.html#label-Tasks+with+Arguments)!

Or you could do the super pared down version that I did.

Just `gem install rake`. Then `touch Rakefile` in the top-level directory
for your app. Within the Rakefile is where the tasks go. You could namespace
  your tasks, but since I only need one for now, I did not. 

I wrote a task called `new_post` that takes an argument of the title and
uses the date and title to generate a new markdown file in the `_posts`
directory. The hardest part was figuring out how to parse the arguments. You
could pass in command line arguments with the `VARIABLE=VALUE` syntax, or
you could also pass them in as an array. 

I chose to go the more contemporary array method. and thus ended up with
this script: 

```ruby
require 'rake'
require 'date'

desc 'generates a new post'
task :new_post, [:title] do |t, args|
  date = Time.now

  if args[:title].nil?
    puts "Please enter a title:"
    title = STDIN.gets.chomp
  else
    title = args[:title]
  end
  formatted_title = title.downcase.split(" ").join("-")

  post_title = "#{date.strftime('%Y-%m-%d')}-#{formatted_title}.markdown"
  contents = <<-STR 
---
layout: post
title: "#{title}"
date: #{date.to_s} 
comments: true
categories: 
---
  STR

  File.open("_posts/#{post_title}", "w") do |f|
    f.write(contents)
  end
  puts "New post: #{title} generated"
end

```
Here, I'm parsing the title and turning it into a slug of sorts for the
file name. I'm also doing the same with the date. And then I'm writing the
boilerplate Jekyll post contents as a
[heredoc](http://blog.jayfields.com/2006/12/ruby-multiline-strings-here-doc-or.html). I'm also using Ruby's `File` abstraction in order to manage the creation and writing of the file. More details [here](https://ruby-doc.org/core-2.2.0/File.html#method-c-new). 

To run the task from the command line, just type `rake new_post['title goes
here']` and a new post will be generated. I'm also handling the case that I
forgot to pass in the title explicitly, which honestly seems pretty likely,
so I check if the title argument is empty and prompt for a title in that
event. 

Anyway, this is working well enough for me, so I think I'll leave it until I
need something more robust. And that's Rake tasks in a nutshell.

Additionally, I included a description of `desc 'generates a new post'` right
above the definition of my task so that the tasks will be listed when I run
`rake -T`. That's another best practice to keep your code well-documented.

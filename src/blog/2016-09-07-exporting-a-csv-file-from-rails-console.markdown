---
layout: post
title: "Exporting a CSV File from Rails Console"
date: 2016-09-07T20:14:44-04:00
comments: true
categories: 
---

TIL that creating your own CSV file from Rails console, or, I suppose,
anywhere in Ruby isn't that hard. 

All you have to do is use the `CSV` class, which is part of [Ruby's standard
library](http://ruby-doc.org/stdlib-2.0.0/libdoc/csv/rdoc/CSV.html).

First decide what data you want to have in your CSV. Perhaps you have a list
of users and you want to output their id, name, and GitHub username. (I live
in a world where all users have GitHub usernames.)

Open up a Rails console with a little `rails c` magic. Then queue up your
users. 

`users = User.where.not(github_username: nil)`

Determine the location of where you want your file to be stored. If you're
doing this on a remote server, you probably want to put the file in a
temporary loation. Something like

`file = "#{Rails.root}/tmp/#{Date.current}-user_list.csv"` 

will probably do. 

Now, it's time iterate over your users and write to that CSV.

```ruby
CSV.open(file, 'w') do |csv|
  users.each do |user|
     csv << [user.id, user.name, user.github_username]
  end
end
```

And that's pretty much it. Your file will be located at the path you
created. 

Now, you'll probably also want to grab the file off the remote server, and
you would do that with `scp`, which refers to secure copy.

To copy the file, you'd run a variation of this command from your command
line: 

`scp username@remotehost.com:/path/to/file /local/path/to/file`

As long as you can ssh onto your remote server and you have the right paths,
you should be good to go! 

And that's what I learned today about CSV and scp.

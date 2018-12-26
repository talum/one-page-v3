---
layout: post
title: "Refactoring with the Strategy Pattern"
date: 2017-03-17T08:53:39-04:00
comments: true
categories: ["refactoring", "strategy pattern"]
---

About a year ago, as part of the technical book club on the labs team at
Flatiron School, we read the infamous *Design Patterns - Elements of
Reusable Object-Oriented Software* by the Gang of Four. Perhaps tried to
read is more accurate. As a beginner and Rubyist, I found that much of the original book
went over my head, so I instead the updated, Ruby version of the patterns,
*Design Patterns in Ruby*, by Russ Olsen.

Although a lot of that went over my head too, as a group, we decided that
most of the design patterns boil down to the strategy pattern, so that's the
one that I've tried to focus on and incorporate into my applications as much
as possible. 

# Strategy Pattern

According to [OO Design.com](http://www.oodesign.com/strategy-pattern.html),
the intent of the strategy pattern is to "define a family of algorithms,
encapsulate each one, and make them interchangeable." The way I've
interpreted this is that when a client (whatever's going to be calling your code)
needs to perform an operation that varies slightly based on the situation, whether that's in response to input
or based on different conditions that can be detected, you can use the strategy pattern to
simplify the interface.

# Strategy Pattern in Practice (A Use Case)

Recently, I was working on updating a script to batch update a bunch of
curriculum used on [Learn.co](https://learn.co). Already in existence was a
[Learn Writer Script](https://github.com/flatiron-labs/learn-writer-script),
which a colleague of mine wrote to open source our curriculum. This script
essentially added the three files needed to make valid content for Learn,
the `.learn`, `CONTRIBUTING.md`, and `LICENSE.md`. That was all well and
good when that's all we needed to do, but a new use case, the need to
reformat a bunch of readmes that were incorrectly created as labs.

This to me sounded like a perfect use case for the strategy pattern because
I wanted the client to be able to vary the algorithm such that it could
still open source curriculum and also toggle labs to readmes. The easy
patch, of course, would be to just add some janky code that would handle
that, but I felt this would be an excellent excuse to make the script more
flexible and enable additional strategies to be incorporated in the future.

# Using the Strategy Pattern

After inspecting the existing code, I noticed that there was a class called
`RepoWriter` that handled writing the three required files if they didn't
exist. This class both configured the GitHub client (using Octokit) and
handled checking the GitHub repo for the files and writing them if they
didn't already exist. (We store our curriculum in GitHub repositories.)

In order to make this more flexible, I decided to turn this class into a
strategy, `OpenSource`. Then I defined a `Base Strategy`, that would
abstract away all the shared behavior among all strategies. Finally, I
defined a new class, `ToggleToReadme` that would remove files such as
`index.html`, `index.js`, and `package.json`, and recursively remove
everything in a `spec` or `test` directory.

Prior to my refactor, the `bin/run` file would take an array of repos, and
pass them into the `RepoWriter`, then call the method `write_to_repo` on it.

```ruby

# /bin/run

#!/usr/bin/env ruby

require_relative "../config/environment"

# get the secret octo_token
secrets = YAML::load(File.open(Dir.pwd + '/config/application.yml'))

# take array of repo urls, collect names
repos = ["https://github.com/SophieDeBenedetto/test-writer", "https://github.com/SophieDeBenedetto/test-writer-2"]
repos = repos.map { |repo| Repo.new(repo) }

# write content for each repo
repos.each do |repo|
  RepoWriter.new(repo, secrets).write_to_repo
end

```

The `RepoWriter` class was defined as such:

```ruby
#
class RepoWriter

  VALID_LICENSE = File.open(File.expand_path(File.dirname(__FILE__)) + '/fixtures/LICENSE.md')
  VALID_CONTRIBUTING = File.open(File.expand_path(File.dirname(__FILE__)) + '/fixtures/CONTRIBUTING.md')
  VALID_DOT_LEARN = File.open(File.expand_path(File.dirname(__FILE__)) + '/fixtures/VALID_DOT_LEARN.yml')
  APPLICATION_TOKENS_PATH = File.open(Dir.pwd + '/config/application.yml')

  
  attr_accessor :client, :repo_content, :repo_name, :owner_name, :secrets

  def initialize(repo, secrets)
    @secrets = secrets
    configure_client
    @repo_name = repo.name
    @owner_name = repo.owner
    @repo_content = {contributing: {sha: " ", present: false}, license: {sha: " ", present: false}, dot_learn: {sha: " ", present: false}}
  end

  def configure_client
    @client ||= Octokit::Client.new(:access_token => self.secrets["octo_token"])
  end

  def write_license
    license_content = File.read(VALID_LICENSE)
    client.create_contents("#{owner_name}/#{repo_name}", "LICENSE.md", "create license", license_content)
  end

  def write_contributing
    contributing_content = File.read(VALID_CONTRIBUTING)
    client.create_contents("#{owner_name}/#{repo_name}", "CONTRIBUTING.md", "create contributing", contributing_content)
  end

  def write_dot_learn
    dot_learn_content = File.read(VALID_DOT_LEARN)
    client.create_contents("#{owner_name}/#{repo_name}", ".learn", "create dot_learn", dot_learn_content)
  end

  def check_for_file_presence
    files = client.contents("#{owner_name}/#{repo_name}", path: "")
    files.each do |file|
      if file[:name] == "CONTRIBUTING.md"
        self.repo_content[:contributing][:sha] = file[:sha]
        self.repo_content[:contributing][:present] = true
      elsif file[:name] == "LICENSE.md"
        self.repo_content[:license][:sha] = file[:sha]
        self.repo_content[:license][:present] = true
      elsif file[:name] == ".learn"
        self.repo_content[:dot_learn][:sha] = file[:sha]
        self.repo_content[:dot_learn][:present] = true
      end
    end
  end

  def find_or_create(type)
    unless self.repo_content[type.to_sym][:present]
      send("write_#{type}")
    end
  end

  def write_to_repo
    check_for_file_presence
    ["license", "dot_learn", "contributing"].each do |type|
      find_or_create(type)
    end
  end
end

```

After a bunch of refactoring, I decided that I'd rewrite the `bin/run` as follows:

```ruby
# bin/run

#!/usr/bin/env ruby

require_relative "../config/environment"

# get the secret octo_token
secrets = YAML::load(File.open(Dir.pwd + '/config/application.yml'))

#parse strategy from command line
strategy = ARGV.first
raise "Strategy undefined" unless BaseStrategy::VALID_STRATEGIES.include?(strategy)

# parse CSV of repo urls
csv_path = ARGV[1]
raise "Must provide path to CSV" if csv_path.empty?

repos = []
CSV.foreach(csv_path) do |row|
  repos << Repo.new(row.first)
end

repos.each do |repo|
  Object.const_get(strategy).new(repo, secrets).execute
end

```
So here, I'm allowing the user to pass in a strategy from the command line. That
strategy is then validated. I also did a little refactor to allow the program 
to accept a path to a CSV, which I would then parse.

What's really interesting for me is turning the strategy passed from the command
line a class, creating an instance of that class, and then calling `execute` on it, service-object style.
This bit of metaprogramming allows us to dynamically execute the correct strategy based
on the user's input.

Then, as I mentioned before, I encapsulated each "algorithm" into a separate class. Within
a `lib/strategies` directory, I placed the `BaseStrategy`, `OpenSource`, and `ToggleToReadme` classes.

In the new paradigm, `BaseStrategy`, handled configuring the client and generating a hash of relevant files.

```ruby
# lib/strategies/base_strategy.rb

class BaseStrategy
  VALID_STRATEGIES = ["OpenSource", "ToggleToReadme"]

  def initialize(repo, secrets)
    @secrets = secrets
    configure_client
    @repo_name = repo.name
    @owner_name = repo.owner
    @repo_content = generate_repo_content_hash
  end

  def configure_client
    @client ||= Octokit::Client.new(:access_token => self.secrets["octo_token"])
  end

  def generate_repo_content_hash
    relevant_files.each_with_object({}) do |file, hash|
      hash[filename_to_sym(file)] = {sha: " ", present: false}
    end
  end

  def filename_to_sym(filename)
    filename.gsub(".", "_").to_sym
  end

end

```

`OpenSource` and `ToggleToReadme` both inherit from `BaseStrategy`, but are specialized to handle their specific operations.

```ruby
# lib/strategies/open_source.rb
class OpenSource < BaseStrategy

  VALID_LICENSE      = File.open(File.expand_path(File.dirname(File.dirname(__FILE__))) + '/fixtures/LICENSE.md')
  VALID_CONTRIBUTING = File.open(File.expand_path(File.dirname(File.dirname(__FILE__))) + '/fixtures/CONTRIBUTING.md')
  VALID_DOT_LEARN    = File.open(File.expand_path(File.dirname(File.dirname(__FILE__))) + '/fixtures/VALID_DOT_LEARN.yml')
  APPLICATION_TOKENS_PATH = File.open(Dir.pwd + '/config/application.yml')

  attr_accessor :client, :repo_content, :repo_name, :owner_name, :secrets

  def execute
    check_for_file_presence
    write_to_repo
  end

  private

  def relevant_files
    ["LICENSE.md", "CONTRIBUTING.md", ".learn"]
  end

  def write_licensemd
    license_content = File.read(VALID_LICENSE)
    client.create_contents("#{owner_name}/#{repo_name}", "LICENSE.md", "create license", license_content)
  end

  def write_contributingmd
    contributing_content = File.read(VALID_CONTRIBUTING)
    client.create_contents("#{owner_name}/#{repo_name}", "CONTRIBUTING.md", "create contributing", contributing_content)
  end

  def write_learn
    dot_learn_content = File.read(VALID_DOT_LEARN)
    client.create_contents("#{owner_name}/#{repo_name}", ".learn", "create dot_learn", dot_learn_content)
  end

  def check_for_file_presence
    files = client.contents("#{owner_name}/#{repo_name}", path: "")
    files.each do |file|
      if relevant_files.include?(file[:name])
        self.repo_content[filename_to_sym(file[:name])][:sha] = file[:sha]
        self.repo_content[filename_to_sym(file[:name])][:present] = true
      end
    end
  end

  def find_or_create(file)
    unless self.repo_content[filename_to_sym(file)][:present]
      send("write_#{file.gsub(".", "").downcase}")
    end
  end

  def write_to_repo
    relevant_files.each do |file|
      find_or_create(file)
    end
  end
end

```

And finally, `ToggleToReadme` uses `Octokit` slightly differently so that it can recursively remove the `test` or `spec` directory.

```ruby
# lib/strategies/toggle_to_readme.rb

class ToggleToReadme < BaseStrategy
  attr_reader :client, :repo_name, :owner_name, :secrets, :repo_content, :files, :spec_files

  def initialize(repo, secrets)
    super(repo, secrets) 
    @spec_files = []
  end
 
  def execute
    get_files
    check_for_file_presence
    delete_files
    check_for_spec_directory
    delete_specs
  end

  private

  def relevant_files
    [ "index.html", "index.js", "package.json"]
  end

  def delete_files
    relevant_files.each do |file|
      file_hash = repo_content[filename_to_sym(file)]
      if file_hash[:present]
        delete(file, file_hash[:sha])
      end
    end
  end

  def delete_specs
    spec_files.each do |file|
      delete(file[:path], file[:sha])
    end
  end

  def delete(filename, sha)
    unless filename == "spec" || filename == "test"
      client.delete_contents("#{owner_name}/#{repo_name}", "#{filename}", "deleting #{filename}", sha)
    end
  end

  def get_files
    sha = client.ref("#{owner_name}/#{repo_name}", "heads/master").object.sha
    sha_base_tree = client.commit("#{owner_name}/#{repo_name}", sha).commit.tree.sha
    @files = client.tree("#{owner_name}/#{repo_name}", sha_base_tree, :recursive => true).tree
  end

  def check_for_file_presence
    files.each do |file|
      if relevant_files.include?(file[:path])
        self.repo_content[filename_to_sym(file[:path])][:sha] = file[:sha]
        self.repo_content[filename_to_sym(file[:path])][:present] = true
      end
    end
  end

  def check_for_spec_directory
    files.each do |file|
      if file.path.include?("test") || file.path.include?("spec")
        spec_files << { path: file.path, sha: file.sha }
      end
    end
  end

end

```

There's of course still room to improve this script, but refactoring has been super fun!
Now, if we ever need to batch update curriculum again in a slightly different way, we
could just define a new strategy in `lib/strategies`, whitelist it within `BaseStrategy`, 
and then just run the script. Whoot! Hooray for the strategy pattern.


## Resources
- [Design Patterns in Ruby](http://designpatternsinruby.com/)
- [OO Design](http://www.oodesign.com/strategy-pattern.html)

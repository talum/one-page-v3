---
layout: post
title: "Which Data Structure Should I Use? An Elixir Cheat Sheet"
date: 2018-08-05T10:14:24-04:00
comments: true
categories: ['elixir']
---

As an Elixir novice, I think one of the hardest things about getting started in
Elixir is figuring out what kind of data structures to use. My team
has recently started going all in on Elixir, so I've been trying to brush up
in earnest. Often, however, I'll be reading over some of my team's code and have a hard time deciphering what I'm
even looking at. The syntax looks very similar to Ruby (which I know pretty
well), but the patterns, conventions, and data structures are just
_slightly_ different. In my mind, that makes sense since it's a functional
rather than object-oriented language: where you would use objects in
Ruby, you're probably spawning processes instead in Elixir.

For what it's worth, learning Elixir reminds me a lot of when I learned Spanish for the
first time and thought to myself, _this alphabet looks familiar, but there
are all these extra letters!_ Thanks to cognates, I can get by in Spanish. Learning Elixir feels a lot like that to me.

But anyway, since I'm learning Elixir now, I thought it'd be useful to
provide a cheat sheet or overview of the differences in data structures I've noticed as a
Rubyist exploring Elixir.

## Data Types

If you're coming from Ruby (or most other programming languages), integers,
floating-point numbers, ranges, and regular expressions are all probably
familiar to you. Fortunately, those all exist in Elixir too. There are a few
differences, but I haven't dealt too much with them yet.

Atoms are like symbols in Ruby. They begin with colons and their names are
their values. For example, `:hello` is a valid atom in Elixir. They're often
used to tag values.

There are also strings in Elixir. Strings always have double quotation marks, while charlists are in single quotations marks. Strings are binaries, and charlists are actually just lists of code points. I have rarely used charlists so far.

Here's a quick glance at what those types look like

```elixir
iex> 2         # integer
iex> 2.0       # floating point
iex> false     # boolean
iex> 1..4      # range
iex> ~r/hello/ # regular expression
iex> :hello    # atom
iex> "world"   # string
iex> 'world'   # charlist
```

Elixir has the additional data types, `Port` and `PID`, which
are used in process communication. They are entities that are made available
through the Erlang VM.

### Port
A `Port` is used to communicate (read/write) to resources outside your
application. They are great for starting operating system processes and
communicating with them. For example, you might want to open a port to run an
OS command, like `echo`.

You could open a port and send it a message, like this:

```elixir
iex> port = Port.open({:spawn, "echo sup"}, [:binary])
#Port<0.1305>
```

Then, you can use the `flush()` IEx helper to print the messages from the
port.

```elixir
iex> port = Port.open({:spawn, "echo sup"}, [:binary])
#Port<0.1305>
iex> flush()
iex> {#Port<0.1305>, {:data, "sup\n"}}
iex> :ok
```

You can send a port any name of a binary you want to execute. For example,
from the directory of my jekyll blog, I opened up an `iex` session, opened a
port, and then sent the `bundle install` command, which installed all the
Ruby gem dependencies. Here's a snippet of the output.

```elixir
iex> port = Port.open({:spawn, "bundle install"}, [:binary])
#Port<0.1306>
iex> flush()
{#Port<0.1306>, {:data, "Using concurrent-ruby 1.0.5\n"}}
{#Port<0.1306>, {:data, "Using i18n 0.9.5\n"}}
{#Port<0.1306>, {:data, "Using minitest 5.11.3\n"}}
{#Port<0.1306>, {:data, "Using thread_safe 0.3.6\n"}}
{#Port<0.1306>, {:data, "Using tzinfo 1.2.5\n"}}
{#Port<0.1306>, {:data, "Using activesupport 4.2.10\n"}}
{#Port<0.1306>, {:data, "Using public_suffix 2.0.5\n"}}
{#Port<0.1306>, {:data, "Using addressable 2.5.2\n"}}
{#Port<0.1306>, {:data, "Using bundler 1.16.2\n"}}
{#Port<0.1306>, {:data, "Using coffee-script-source 1.11.1\n"}}
{#Port<0.1306>, {:data, "Using execjs 2.7.0\n"}}
{#Port<0.1306>,
 {:data,
  "Bundle complete! 4 Gemfile dependencies, 85 gems now installed.\nUse `bundle info [gemname]` to see where a bundled gem is installed.\n"}}
:ok
```

### PID
A `PID` is a reference to a process. Whenever you spawn a new process, you'll
get a new PID. Expect to talk a lot about PIDs. You'll probably need to hold
onto PIDs so you can send different processes messages.

Here's an example of spawning a process and getting the PID back.

```elixir
iex> pid = spawn fn -> IO.puts("hello world") end
iex> hello world
iex> #PID<0.123.0>
```

The process dies after it has done its job. PIDs and Ports warrant their own standalone post, but for now, I think it's sufficient to just be aware that they exist.

So, now that we've added our new types, this is our basic cheat sheet.

# The Elixir Data Type Cheat Sheet

```elixir
iex> 2             # integer
iex> 2.0           # floating point
iex> false         # boolean
iex> 1..4          # range
iex> ~r/hello/     # regular expression
iex> :hello        # atom
iex> "world"       # string
iex> 'world'       # charlist
iex> #Port<0.1306> # port
iex> #PID<0.123.0> # pid
```

The real challenge with Elixir in my opinion, though, is figuring out how to
organize these basic data types into structures you can use. So let's take a
look at the various collection types and why you would use each.

## Collection Types
Here are the collection types you'll likely encounter:
- Tuples
- Lists
- Keyword Lists
- Maps
- Structs

You've probably heard those words before, at least in passing, but if you're accustomed to Ruby, you're probably wondering why you need all those extra types of collections. Let's investigate.

### Tuples
Tuples are ordered collections of values. They look like this:

```elixir
iex> {:hello, "world"}
iex> {1, 2}
iex> {:ok, "this is amazing!", 2}

# You can check if it's really a tuple
iex> tuple = { "hello", "world"}
iex> is_tuple tuple
iex> true

# and then you can get an element from a tuple by index
iex> elem(tuple, 1)
iex> "world"
```
I think tuples are a little wild. I mean, they look like they should be hashes, but they sort of behave like Ruby arrays. And then they're called tuples! It'll pay off to get familiar with them though, which is what I keep telling myself when I get confused for the hundredth time.

Tuples crop up all over the place in Elixir. Return values of functions are often tuples that you can pattern match on, so it makes sense to start seeing the world through tuples. Tuples usually have two to four elements, and at this point, they're my go-to data structure. When you're dealing with data structures that have more than four elements, that's probably a good case for using a map or struct instead.

### Lists
Lists are linked data structures. They look like this:

```elixir
iex> [1, 2, 3, 4]
iex> ["hello", "world"]
```

In Ruby, you'd think that was an array, but in Elixir, it's a list! Because lists are implemented as linked data structures, they're good for recursion, but bad for randomly retrieving an element or even figuring out the length because you'd need to traverse the whole list to figure out the size. To date, I've mostly been using tuples instead of lists. If you had to choose between them, I suppose you'd need to consider the expected size of the collection and what kind of operations you'll be performing on it.

### Keyword Lists

To further complicate matters, there are also such things as keyword lists in Elixir. In essence, this is a list of two-value tuples.

```elixir
# keyword list
iex> [ phrase: "oh hello", name: "tracy" ]

# is actually two-value tuples
iex> [ {:phrase, "oh hello"}, {:name, "tracy"} ]
```

This continues to baffle me, even though I am aware of its general existence.The cool thing about keyword lists is that you can have two of the same keys in a keyword list.

```elixir
iex> keyword_list = [food: "peanut butter", food: "ice cream", flavor: "chocolate"] # a valid keyword list
```
Keyword lists are good for command-line parameters and options.

### Maps
Next up are maps. If you wanted a real key-value store, not a list of key-values, this is what you're looking for. They look a bit like hashes in Ruby.

```elixir
iex> %{"greeting" => "hello", "noun" => "world"}
iex> %{:greeting => "hello", :noun => "world"}
iex> %{greeting: "hello", noun: "world"} # if the keys are atoms, you can skip the hash rockets.

iex> greeting = %{spanish: "hola", chinese: "ni hao", english: "hello"}
iex> greeting[:spanish]
iex> "hola"
iex> greeting.chinese
iex> "ni hao"
```
Maps are good for passing associative data around, and pretty much everything else that is bigger than tuple size.

### Structs

Structs are like enhanced maps. They permit only certain keys and those keys must be atoms. Structs need to be defined in modules with reasonable default values. They're maps with rules.

```elixir
iex> defmodule IceCream do
....   defstruct flavor: "", quantity: 0
.... end

iex> chocolate = %IceCream{flavor: "chocolate"}
iex> chocolate.flavor
iex> "chocolate"
```

You'll see that the struct is defined with the same `%` percent symbol as a map, but it's followed by the name of the module. That's how I remind myself that they're just stricter maps.

Older versions of Elixir used to also include the `HashDict` to handle maps with more than a couple hundred values, but that module has been deprecated in favor of the good ol'fashioned `Map`.

That brings us to the end of the common data types and collection types you'll see in Elixir. Although there are a number of differences between the two languages, there are some similarities. Of course, there's plenty more to learn about Elixir, the conventions, and the cool things you can do, but this (I think) is a good start to getting familiar with the language. Hopefully this'll serve as a decent guide to deciphering any Elixir you might encounter soon!

## The Elixir Collection Cheat Sheet
```elixir
iex> {:ok, "this is amazing!", 2}                                         # tuple
iex> ["hello", "world"]                                                   # list
iex> [ phrase: "oh hello", name: "tracy" ]                                # keyword list
iex> greeting = %{spanish: "hola", chinese: "ni hao", english: "hello"}   # map
iex> chocolate = %IceCream{flavor: "chocolate"}                           # struct
```


## Resources
- [Basic Types](https://elixir-lang.org/getting-started/basic-types.html) on
  Elixir Lang
- [Programming Elixir](https://pragprog.com/book/elixir16/programming-elixir-1-6) by Dave Thomas
- [Hex Docs](https://hexdocs.pm/elixir/)



---
layout: post
title: "Important Things I Learned from Reading Practical Vim"
date: 2017-12-27 14:42:12 -0500 
comments: true
categories: ["vim"]
---

I started reading _Practical Vim_ by Drew Neil after Christmas because I
truly think this will be the year I go all in on vim. I'll be honest: I _am_
doing it to seem a little cooler and intimidating, but I'm also doing it
because I think there are some efficiencies to be gained from having my
fingers leave the keyboard less. Also, there was this neat quote I
encountered while reading the book: 

>"The painter does not rest with a brush
on the canvas. And so it is with Vim."

What I think this quote highlights is
that a lot of programming is done without one's hands on an actual keyboard.
That is, you don't just mindlessly type code all day and hope it works. The real work
behind programming is in thinking about problems and then writing out
solutions to them. What Vim provides is an alternative to the "insert mode"
that most text editors come with by default. This way, you won't be as
tempted to start typing before you're ready.

Anyway, as you may know if you follow this blog at all, I've been dipping in
and out of vim for the past year or so, but now that I've got this nifty
book, I think I'll be able to move beyond a novice level. 

For starters, here are some tips I picked up.

**Real Lines vs Display Lines**

Holy cow, did you know that there's a name for the lines that aren't
actually lines when text wrap is enabled? Yeah, they're called **display
lines**. Shoot. And you can navigate them by using g-prefixed `j` and `k`.
This blew my mind. All this time I've been tooling around with search when I
could have been smartly navigating. Gosh. I'm disappointed in myself.

| Command | Move |
|---------|------:|
|`gj`      | Down one display line|
|`gk`      | Up one display line|
|`g0`      | To first character of display line|
|`g$`      | To end of display line |

<br>

**The Dot Command**

I've been doing everything wrong for the past year. I should have been using
the dot command, which this books calls a "micro macro." The dot command
allows you to repeat the last change. This is useful when you need to append
punctation to multiple lines, or wrap lines in ticks or something, like I
just did above. While my cursor was on the first line of the table, I hit
`i`, inserted a backtick, exited, then `j`'d down to the next line and hit
the `.`, which repeated my change. I did the same for the following two
lines, and then followed a similar process to end the backtick.

Another way to do this would be to select the blocks in visual mode, then
run the dot command in normal mode with `:'<,'>normal .` Or use visual block
mode, but that's a little more complicated than I want to tackle right now. 

**Duplicating and Moving Lines with :t and :m in Command Mode**

Turns out there's a way easier way to move and copy lines when they're far
away from each other within a file.

You can use the `:copy` and `:move` commands. The shortcut versions are `:t`
and `:m`, respectively. These commands follo wthe format `:[range]command
{address}`.

Here are some examples:

|Command | Translation|
|--------|------------:|
|`6t.` | Copy line 6 and insert it below the current line|
|`1t2` | Copy line 1 and insert it below line 2|
|`2m4` | Move line 2 to below line 4|

<br>

**Tab Pages**

I've been using NerdTREE to manage my file tree, so I won't dive too much
into buffer management, but what I did thing was cool was the idea of having
tab pages.

Turns out you can create a tab pretty simply with `<C-w>T`, which means that
you hold control and w at the same time and then press capital T. The <>
notation signifies a chord, holding a few keys down at the same time. You do
need to have at least one window open in order to this.

Navigating between tabs is as simple as using `gt` to go forwards or `gT` to
go backwards. You can also go to tabs by number.

Here's the tab cheatsheet I've always wanted.

|Command | Translation|
|--------|------------:|
|:tabe[dit] {filename} | Open {filename} in new tab |
|:tabc[lose] | Close current tab and windows | 
|:tabo[nly] | Keep active tab page, close all others |
|:tabn[ext] {N} | Switch to tab number {N} |
|:tabn[ext] / `gt` | Switch to next tab page |
|:tabp[revious] / `gT` | Switch to the previous tab page |

<br>

So far I'm about 100 pages in and already this book is making me rethink how
I'm using vim. If you are struggling to get better at the text editor
everyone loves to hate and hates to love, I can't recommend this book
enough.



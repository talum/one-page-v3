---
layout: post
title: "Setting Up ESLint Globally"
date: 2017-12-28T08:59:50-05:00
comments: true
categories: ["javascript", "eslint"]
---
![Vim
ESLint](https://s3-us-west-2.amazonaws.com/talum.github.io/vimlint.png)

For a while, I was using [StandardJS](https://standardjs.com/) to lint my
JavaScript files because it required virtually no setup and it was easy to
use. I had also enabled format on save, so my JavaScript files were always
pristine before I committed them to master. 

This would have been fine, but my team wanted more granularity over the
rules we'd follow, so after some discussion, we decided to go with ESLint,
and lint according to most of the rules of Airbnb's [style
guide](https://github.com/airbnb/javascript).

# What Is ESLint?

ESLint is a highly configurable tool for well, linting. It finds patterns in
JavaScript (ECMAScript) so that you can ideally have more consistent, less
buggy code.

# Setup

The setup instructions are fairly straightforward on
[ESLint's](https://eslint.org/docs/user-guide/getting-started)
documentation. You should know that you can install it either locally or
globally, that is within a specific project or for your whole system.

While I was doing the initial setup, I kept making the mistake of installing
packages inconsistently (sometimes globally, sometimes locally, sometimes
with npm, sometimes with yarn), so the eslint binary couldn't find the right config
files. It was a mess, but one I soon solved by removing the packages and
reinstalling them fresh.

# Global

If you want to go with a global setup, you'll need to install all of the
packages globally. The folks at ESLint recommned a local setup in general,
but heck, I work on a lot of JavaScript, and I don't always want to have to
install `eslint`. I want to follow a set of rules consistently. Thus, I
opted for the global installation.

## 1. Install the packages.

These are the commands you'll need to set it up with yarn:

`$ yarn global add eslint eslint-config-airbnb`

And then some other dependencies:

`$ yarn global add eslint-plugin-jsx-a11y@^2.0.0 eslint-plugin-react
eslint-plugin-import babel-eslint`

## 2. Create the global config file

Create a file called `.eslintrc` in your home directory. This can also be any
parent directory that contains all of your work. I put mine in my home
directory because all my configs live there anyway.

Its contents:

```
{
  "extends": "airbnb",
    "rules": {
      "semi": ["error", "never"],
      "comma-dangle": ["error", "never"]
    }
}
```

Essentially, this is a customization of Airbnb's style guide. I overwrite
the rules for semicolons and commas at the end of a list because I don't
like them. Airbnb talks at length about the benefits of semicolons, but that
ship has sailed for me. I really don't want to add them back into my life.

## 3. Start linting, or integrate the linter into your text editor.

At this point, you coud run the command `eslint` on any JS file in your
system and it would output the problems in your file. That's probably not
how you want to integrate a linter in your workflow, however, unless you
wanted to run the linter as prerequisite to merging.

What you more likely want is to integrate the linter into your text editor
so that it highlights errors as you make them and (possibly) corrects them
when you save.

I tested a couple solutions for my team's preferred text editors: Vim,
Sublime, and Atom.

### Vim

As I mentioned in previous posts, I'm going all in on Vim this year, so I
started there. I had trouble installing Syntastic, which the ESLint folks
recommend using. Instead, I set up Ale, which is a plugin for Vim that was
actually easy to set up.

First, I installed Ale using Pathogen. I'm assuming if you're using Vim,
you're familar enough with your chosen package manager to install this
plugin using that.

Then, I wanted to expicitly specify which linters should be run for certain
file types, I added these lines to my `.vimrc`.

```
let g:ale_linters = {
\  'javascript': ['eslint'],
\  'jsx': ['eslint']
\}
```

Then, I also like to have my linter fix and format on save, so I set this
config as well:

```
let g:ale_fixers = {
\  'javascript': ['eslint'],
\  'jsx': ['eslint']
\}
```

```
let g:ale_sign_column_always = 1
let g:ale_fix_on_save = 1
```

Open up Vim and now you should be in business!

If you want to set up ESLint locally instead, you can totally do that as
well. ESLint will look first in the project for the closest config file.
Finding none, it will keep looking in parent directories until it finds one.


### Sublime

![Sublime
ESLint](https://s3-us-west-2.amazonaws.com/talum.github.io/sublimelint.png)

For integration with Sublime, I checked out
[SublimeLinter-eslint](https://github.com/roadhump/SublimeLinter-eslint).
This was also pretty easy to set up. First, you'll need to ensure that you
have [SublimeLinter](http://www.sublimelinter.com/en/latest/) installed.
This is the linting framework that uses a number of plugins that do the
actual linting. Then, I used Package Control to install the linting package,
SublimeLinter-eslint, and then...started using it. Fortunately, it appears that `eslint`
is in my system PATH, so I didn't have to check out how the linter
executables work and all that jazz.

With ESLint and Sublime, I didn't see a config for formatting on save, so to
do that, you'll probably need to set up
 [Prettier](https://github.com/prettier/prettier). To me, Prettier has way
too many options and too many opinions, but maybe I'll change my mind in a
 few months. I think linting is enough for now.


### Atom

![Atom
ESLint](https://s3-us-west-2.amazonaws.com/talum.github.io/atomlint.png)

The Atom setup was also thankfully pretty simple. The linting package that
ESLint recommended was
[linter-eslint](https://atom.io/packages/linter-eslint). Following the
install instructions, I did the following:

`$ apm install linter-eslint`

Then, I went and enabled some settings. This was located at Atom >
Preferences > Packages. Then I found the package (linter-eslint) and clicked
on the settings button and scrolled down.

I'm not a big Atom user, but what
was really nice were the settings. You could be really explicit about which
eslint to use, local or global. You could also specify whether to try to fix
on save or not. So in this case, I'm going to say that Atom probably wins in
terms of ease of use and setup.

The second time I did this, I had to install some linting package
dependencies. If you're missing them, Atom will warn you that you need to
install them.

So that's all I've got on linting so far. May your code be clean and
bug-free.


# Resources
- [ESLint](https://eslint.org)
- [Ale](https://github.com/w0rp/ale)
- [Sublime Linter -
  ESLint](https://github.com/roadhump/SublimeLinter-eslint)
- [Linter-ESLint](https://atom.io/packages/linter-eslint)
- [How to Set up ESLint with Airbnb JavaScript Style Guide in WebStorm](https://www.themarketingtechnologist.co/eslint-with-airbnb-javascript-style-guide-in-webstorm/)

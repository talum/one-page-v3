---
layout: post
title: "How to Amend a Git Commit Author"
date: 2021-07-24T16:06:00-04:00
comments: true
categories: ["git"]
---

Recently, I enabled the "[Keep my email address
private](https://docs.github.com/en/github/setting-up-and-managing-your-github-user-account/managing-email-preferences/blocking-command-line-pushes-that-expose-your-personal-email-address)" feature on GitHub.
This isn't all that useful to me at the moment since my email addresss is
floating around the internet already, but I figure one day I'll take the
steps necessary to purge my contact information from the web.

Anyway, if you haven't enabled this feature yet, it's cool. GitHub will give
you a no-reply address to set as the email address for your commits. This
way, you don't have to expose your personal deets. And if you forget, no
prob! With the feature enabled, GitHub will block your pushes until you fix
it or turn the feature off.

It came in handy when I set up another laptop for development and had my git
settings configured with my real email address. I had already committed some
changes, and when I pushed them, the push failed! Hooray. So then I had to
figure out how to change the email address. 🤔

First I tried rebasing the two commits.

`git rebase -i HEAD~2`

This brought me to a screen that looked like this:

```
pick a4b50b4 add tech interviewer post (#59)
pick 542007c Upgrade to Gatsby 3.0 (#67)

# Rebase 0040762..542007c onto 0040762 (2 commands)
#
# Commands:
# p, pick <commit> = use commit
# r, reword <commit> = use commit, but edit the commit message
# e, edit <commit> = use commit, but stop for amending
# s, squash <commit> = use commit, but meld into previous commit
# f, fixup <commit> = like "squash", but discard this commit's log message
# x, exec <command> = run command (the rest of the line) using shell # b, break = stop here (continue rebase later with 'git rebase --continue') # d, drop <commit> = remove commit
# l, label <label> = label current HEAD with a name
# t, reset <label> = reset HEAD to a label
# m, merge [-C <commit> | -c <commit>] <label> [# <oneline>]
# .       create a merge commit using the original merge commit's
# .       message (or the oneline, if no original merge commit was
# .       specified). Use -c <commit> to reword the commit message.
#
# These lines can be re-ordered; they are executed from top to bottom.
#
# If you remove a line here THAT COMMIT WILL BE LOST.
#
# However, if you remove everything, the rebase will be aborted.
#

```

I replaced `pick` with `edit`, so that I could edit each commit individually.

Then, I tried doing `git commit --amend` on each commit, and tried editing the details of the commit.

```
add tech interviewer post (#59)

# Please enter the commit message for your changes. Lines starting
# with '#' will be ignored, and an empty message aborts the commit.
#
# Author:    Tracy Lum <mynoreplyaddress@github.com> <- I tried changing this here
# Date:      Sat May 1 13:54:13 2021 -0400
#
# interactive rebase in progress; onto 0040762
# Last command done (1 command done):
#    edit a4b50b4 add tech interviewer post (#59)
# Next command to do (1 remaining command):
#    edit 542007c Upgrade to Gatsby 3.0 (#67)
# You are currently editing a commit while rebasing branch 'add-git-author-amend' on '0040762'.
#
# Changes to be committed:
#    new file:   src/blog/2021-05-01-tips-from-a-tech-interviewer.md
#
```

Turns out that's not how you do it. It won't work. If you want to amend the author, you'll need to edit the author details differently with this flag:

`git commit --amend --author="Tracy Lum <mynoreplyaddress@github.com>"`

Continuing, I exited edit mode, then proceeded with the rebase.

`git rebase --continue`

and applied the same changes to my next commit.

Then, once the rebase was complete, I was able to push up my changes successfully with a regular old `git push`.

Hooray, author information amended and commits all pushed up!

### Meta
At this point, I believe I am obliged to reveal that I now work at GitHub. Also, I'm trying to get back into my technical blog post writing, so bear with me as I re-learn how to write.

### Sources
- [How can I change the author name / email of a commit](https://www.git-tower.com/learn/git/faq/change-author-name-email/)


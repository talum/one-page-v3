---
layout: post
title: "Customizing Dotfiles for Vim"
date: 2016-09-04T12:53:32-04:00
comments: true
categories: ["vim", "dotfiles"]
---

I've finally gotten around to learning Vim, and wouldn't you know -- it's
not that bad once you get the hang of it. Right now I'm using Vim to write
this post!

But what good would configuring Vim to suit your needs do if you couldn't save
those configs and port them over to another machine?

Enter Zach Holman's [dotfiles](https://github.com/holman/dotfiles). A
coworker of mine recommended forking Holman's dotfiles because they provide
a solid foundation for extracting your dotfiles into subdirectories that
make sense. They also include a script for symlinking your configs and
downloading applications via Homebrew, so getting yourself set up on another
machine is easy.

Wading your way through the repo and learning what everything does takes a
decent amount of time, but once you make that investment, pretty much
everything will be easier.

Now, I don't claim to be an expert on dotfiles, but I did set up my vim
configs the way I want them, so that's what I'll focus this post on. 

Holman's dotfiles come with a subdirectory for each topic area. The idea is
that anything that ends with an extension of `.symlink` will get symlinked
into your `$HOME` directory when you run the install script with
`script/bootstrap`.

For this specific example, I'll look at the Vim stuff. Holman's dotfiles
come with a subdirectory called `vim`. Within that subdirectory is a file
called `vimrc.symlink`. So with the fancy script Holman set up, that means that this
file will get symlinked to your home directory as `.vimrc`. That's the place
to go to configure your vim editor. 

What's a symlink, you ask? It's like a nickname or shortcut to file, or
almost like a redirect to the file. So I can go to `~/.vimrc`, but I'm
actually accessing the file that's located in
`~/dotfiles/vim/vimrc.symlink`. 

The command to create a symlink, by the way, is this: 
`ln -s /path/to/file /path/to/symlink`. 

Some of the basic settings you'll want are as follows, which I've
shamelessly stolen from my vim-using friends and coworkers: 

```
syntax on

filetype indent plugin on  " Wrap gitcommit file types at the appropriate
length
syntax enable      " syntax highlighting
set number         " line numbering
set vb             " flashes screen on errors
set hlsearch       " highlight search terms
set incsearch
set ignorecase

" indentation
set smartindent
set autoindent     " open lines at same indentation
set expandtab      " turn tabs into tabstop spaces
set tabstop=4      " 1 tab = 4 spaces
set shiftwidth=4   " shift 4 spaces 

set textwidth=76
set wildmenu
set mouse=a        " allow mouse
set cursorline     " highlights/underlines current line
set ruler          " shows cursor position

set background=dark
set t_Co=256
```
I've also been experimenting with a package manager called
[pathogen.vim](https://github.com/tpope/vim-pathogen), but that's probably a
post for another day. Some git submodule work is involved with getting all
the packages to sync across your machines. Just for my future reference,
that guide is
[here](http://vimcasts.org/episodes/synchronizing-plugins-with-git-submodules-and-pathogen/).

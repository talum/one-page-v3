---
layout: post
title: "Promises in JavaScript: A Gentle Introduction"
date: 2017-04-17 20:21:52 -0400 
comments: true
categories: ["JavaScript", "promises"]
---

# tl;dr

Personally, I think you should know what Promises are, but you don't *really* need to know the
internals to be a fairly productive developer. You can just use `axios` or
`fetch` and call `then` on the results a couple times and scrape by. OR
you could read the rest of this post and get friendly with Promises if you
want to be awesome.

# Asynchronous Behavior, Callbacks, and Why You Should Get Better Acquainted with Promises

Lately, I've been reading about Promises in JavaScript (major
shoutout to Kyle Simpson and his [You Don't Know JS series](https://github.com/getify/You-Dont-Know-JS)), so I
figured it was time to write a blog post about what I've learned, especially since Promises
are now native in ES6. 

That's great, you're probably thinking, but why do I need to know this? The
answer is that Promises simplify the handling of asynchronous behavior in
JavaScript and have the potential to eradicate callback hell as we know it.
Never encountered callback hell? You probably have, but just didn't realize
it had the potential to be as hellish as it is. Any time you have a series
of asynchronous actions and need deterministic values to be returned, you're probably doing
some crazy gating or latching technique in order to make sure that the data
you want is present.

For instance, let's say you want to do something like this: 

```javascript

// code that won't actually work
let a = ajax('http://some.url')
let b = ajax('http://some.other.url')

function addResponse() {
  return a + b
}

addResponse()

```

You make two ajax calls and want to return the value of both the calls. The
problem is that you don't know exactly when both `a` and `b` will be
available. In order to work around this problem, you could write something
like this using callbacks (and a gate):

```javascript

let a = ajax('http://some.url', sum)
let b = ajax('http://some.other.url', sum)

function sum() {
  if (a && b) { //cool gate #amirite
    return a + b
  }
}

```

This way, we wait until both values resolve before summing them. This
approach, though, could be improved and clarified with Promises. As Kyle
Simpson points out in chapter 2 of his book, [Async and Performance](https://github.com/getify/You-Dont-Know-JS/blob/master/async%20%26%20performance/ch2.md), "It turns out that how we express asynchrony (with callbacks) in our code doesn't map very well at all to that synchronous brain planning behavior." In other words, using callbacks isn't intuitive to our sequential, planning brains. Thus, we turn to Promises.

# What Are Promises?

At their core, Promises are just a way of expressing a future value. Simpson
likens a Promise to a receipt or IOU at a fast food restaurant. You request
something and you get a promise that you'll eventually receive something
back. (Going forward, I'm going to stop capitalizing the word "promises." I
think you get it.)

# Promise Basics

According to the [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), the syntax for a promise is as follows:

```javascript

new Promise ( /* executor */ function(resolve, reject)  { ... })

```

The executor is just a function that is passed the arguments `resolve` and
`reject`. Usually the executor does some asynchronous stuff. When it's done,
it'll call the `resolve` function with a final value. If an error gets
thrown, `reject` will be called instead. Either way, with Promises, you're
guaranteed to get some sort of value, which eliminates the "inversion of
control" problem of callbacks. (When you use callbacks, you're effectively
passing execution of your program, so functions could get called once as
intended, too many times, or never at all.)

Promises have three states: pending, fulfilled, and rejected. Pending means
that it's neither fulfilled or rejected, fulfilled means that the operation
was successful, and rejected means that the operation failed.

# How to Use Promises

If you were writing your own async operation, you'd probably write
something like this: 

```javascript

function fetchSomeData() {
  return new Promise(function(resolve, reject) {

    // an operation to async
    let request = new XMLHttpRequest()
    request.open('GET', '/someUrl')

    request.onload = function () {
      resolve(this.responseText)
      // when the loading is done, it'll resolve
      // with the value
    }

    request.send()
  })
}

```

Now, you can call

```javascript

  fetchSomeData()
    .then((data) => {
      console.log(data)
    })

```

and the data should print out to your console (when it's good and ready).
You can imagine that this is how a lot of libraries such as `fetch` or
`axios` likely end up implementing asynchronous calls with promises.

# Then: Another Cool Thing

Another fun thing about `then` in the promise(d) land is that whenever you
call `then` on a promise, it will return another promise that resolves with
the return value of the callback.

For example:

```javascript
var p = function sayHello() { // just to illustrate that `p` references the `sayHello` function
  return new Promise(function(resolve, reject) {
    var hello = "hello"
    resolve(hello) // here I'm resolving the promise with the string "hello"
  })
}

p().then((data) => console.log(data))

// #=> "hello"
// the `data` argument is the value that the promise resolved with

p()
  .then((data) => data + " there") // this implicit return in ES6 returns "hello there"
  .then((moreData) => console.log(moreData)

// #=> "hello there" 

```

# How You'll Use Promises Most of the Time

So as you can see, promises are pretty awesome and they really want to be
your friend. But to get started using promises, you probably don't need to
know all of this cool stuff.

Most of the time, you'll probably be using libraries such as `fetch` or
`axios`, which make use of the promise API and provide some nice wrappers
for handling asynchronous requests.

Personally, I prefer using `axios` for my projects because you don't have to
resolve two promises, one of which is streaming. (Full disclosure: I have no idea what that
is.)

Anyway, to use `axios` in your project, you'd need to require the node module
into your project via `yarn` or `npm`. Then, assuming you're using some kind
of CommonJS-like bundler, import the package with
webpack, gulp, or browserify.

Wherever you need to make a request in your project, you could write
something as simple as this to get some data and use it:

```javascript

axios.get('api/v1/ice-creams')
  .then((response) => console.log(response))

```
And boom! No need to worry about resolving more than one promise. Axios
handily wraps up all that code for you and provides a super simple API.


# Cool Promise Tricks

One of the coolest promise tricks I've come across, though, is
`Promise.all`, which allows you to dispatch multiple asynchronous actions
and wait for all of them to resolve before proceeding to the next step.

According to the [Promise.all documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all), the method takes in an array (or iterable) of promises, and returns a single promise that resolves when all of the promises in the iterable (array) have resolved. Or it rejects the first promise that rejects.

So, one good use case for `Promise.all`, which I coincidentally encountered
in the codebase I'm currently working on, is fetching data from two
endpoints and merging them client-side. 

The code looks something along the lines of this:

```javascript
let promiseA = fetch('/url?includes=someOfTheThings')
let promiseB = fetch('/url?includes=theRestOfTheThings')
let promiseC = fetch('/url?includes=stillMoreThings')

Promise.all([promiseA, promiseB, promiseC]).then((values) => {
  // values is an array of the results of the resolution of the each promise
  console.log(value[0] + value[1] + value[2])
})

```

In the real code, we do some complex merging with the help of the `lodash`
library. 

Anyway, that's promises in a nutshell. For a more in-depth discussion of
promises, I highly recommend reading chapter 3 of Kyle Simpson's [You Don't Know JS: Async and
Performance](https://github.com/getify/You-Dont-Know-JS/blob/master/async%20%26%20performance/ch3.md). He breaks all of this down in further detail, provides a lot of great examples, and also covers error handling, which I completely glossed over, much like any shipping-focused developer would.

# Resources
- [MDN: Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [You Don't Know JS: Async and Performance](https://github.com/getify/You-Dont-Know-JS/blob/master/async%20%26%20performance)
- [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- [axios](https://github.com/mzabriskie/axios)
- [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)

---
layout: post
title: "An Idiot's Guide to Leveling Up with Ember"
date: 2016-01-28T08:43:15-05:00
comments: true
categories:
---

##Basics of Building an Ember App

I'll preface this by saying that I'm no Emberista, but I one day hope to be. Most of the tutorials I ended up reading in the process of building an Ember app assumed some kind of baseline knowledge, which made it difficult for beginners to jump in. Ember also changed a lot recently, so the other half of the tutorials I tried to follow were woefully out of date. I'll try to avoid the first problem because getting used to the Ember way is hard...so we might as well just all start off as idiots together. As for the second problem, there's not much I can do. Sorry. 

In this post, I'll cover getting started and computed properties, but I'll eventually get to writing posts about cool use cases for Ember's controllers,  select menus, loading multiple models, and authentication. I'm splitting this series into multiple posts for SEO purposes, as well as for my own sanity. 

##Getting Started

For the most part, I used the [Ember CLI's](http://ember-cli.com/) generators to create my framework. I generated an adapter, some components, some controllers, some models, some routes, and some templates. Yeah, it's a lot of code generation, but fortunately, all you have to do is type some variation of "ember g" and you should be set. I'd recommend checking out [Ember 101](https://leanpub.com/ember-cli-101) by Adolfo Builes if you need a step-by-step tutorial. That's what my entire class used to start getting acquainted with Ember, and many of the features I incorporated into my app relied on that book. I read it a couple times and did the code-a-long, but that's just me. 

##Some OBSERVATIONS About Ember 

(Because, you know, computed properties observe changes...ha ha ha)

Although things are named similarly to some counterparts in Rails, they actually do quite different things. 

The following are some of the key differences I noticed. 

**Models** only declare the different attributes and relationships for each type of data. Routes are arguably slightly more important than models in Ember. You need both, but a lot of Ember guides and tutorials will teach you about routes first. 

**Routes** actually load the data from the connected API for use in the view. 

The **`router.js`**, not a routes file, determines which route (more like a route object) will handle a given request. 

The **store** is like a cache or repository for your records, but it is not the database. Controllers and routes have access to the store, so when you're trying to load or create records, you ask the store first. The store, in turn, talks to the adapter, which talks to the connected database. 

**Partials** do exist in Ember. You'll use them to reuse code such as forms. **Components** are separate from partials and encapsulate behavior as well as styling. 

**`outlet`** is a lot like **yield** in Rails, but Ember also has its own form of **`yield`**. Outlets appear in the templates. Yield appears in your components. 

**Templates** are your views. And you need to use Handlebars. 
<!-- more -->

###Ember Computed Properties 
[Ember computed propeties](http://emberjs.com/api/classes/Ember.computed.html) are your friend. Learn them, use them. 

One of the best uses of computed properties I think is to perform validations on the front end. For example, here's what my controller for the `characters/new` route looks like: 

```javascript
import Ember from 'ember';

export default Ember.Controller.extend({
  hasName: Ember.computed.notEmpty('character.name'), 
  hasTitle: Ember.computed.notEmpty('character.title'),
  hasSocialClass: Ember.computed.notEmpty('character.socialClass'),
  hasImageUrl: Ember.computed.notEmpty('character.imageURL'),
  hasActorName: Ember.computed.notEmpty('actor.name'),
  isValid: Ember.computed.and(
    'hasName',
    'hasTitle',
    'hasSocialClass',
    'hasImageUrl',
    'hasActorName'
    ),
    actions:{
      save(){
        if (this.get('isValid')){
          let actor = this.get('actor');
          let character = this.get('character');
          actor.save().then((actor) => {
            character.set('actor', actor);
            character.save().then((character) => {
              this.transitionToRoute('characters.character', character);
            })
          })
        } else{
          this.set('errorMessage', "Please fill in all fields.");
      }
    }
  }
});

```

That's a lot of code, but everything before the actions hash is creating computed properties. The property `isValid` is watching the five previously declared computed properties and determines whether all of those form fields in my template are not empty. 

Then, in the actions hash, the `save()` method gets the value of `isValid` and saves the character and actor if the submission is valid. You need to `set` and `get` computed properties to ensure they are the dynamically updated versions. 

After the save, I make the controller transition to a different route. I used `this.transitionToRoute` rather than `this.transitionTo` because we're in the controller rather than a route. That took me far longer than I'd like to admit to figure out. Also, you'll notice that I'm using ES6 syntax and the fat arrow to preserve lexical `this`. 

By the way, if you're working with a single model, you'd probably end up calling the model 'model' and saving it, but I've loaded two models in my route, which is why I call one model "character" and another "actor". More on that later, in another post. 

You'll notice that I put this code in the controller rather than the route. I did that mostly because Ember 101, the book, told me to, and because "isValid" is sort of like a state. Normally, routes should handle most of the standard CRUD actions, anything that deals with persisting records to the database. You have somewhat of a choice on where to place certain actions because of the way that "bubbling up" in Ember works. Actions bubble up from the controller associated with a route, to the route, to the parent route, and ultimately to the application route.  

Cool, so that's just one use for computed properties. You could probably think of some more. If you feel I've deprived you of some essential Ember knowledge, check out the Ember Guides, [this tutorial](http://ember.vicramon.com/the-ember-object), and the Ember 101 book.

For my next post, I'll start digging into the nitty gritty cool things I learned. 


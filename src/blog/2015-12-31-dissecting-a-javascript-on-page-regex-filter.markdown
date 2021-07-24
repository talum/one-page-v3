---
layout: post
title: "Dissecting a JavaScript On-Page RegEx Filter"
date: 2015-12-31T09:49:18-05:00
comments: true
categories: ["Flatiron&nbsp;School"]
---

It occurred to me while building [Sourcery](https://the-sourcery.herokuapp.com/) that, once our app gains traction and has tons of groups and followers, users might want to be able to filter or search through the massive amounts of information we display on a page. 

And after seeing some awesome displays of on-page filtering using an input field and JavaScript, I decided to try to implement it myself. Fortunately, after quickly consulting StackOverflow, I found a beautiful solution from user [dfsq](http://stackoverflow.com/questions/9127498/how-to-perform-a-real-time-search-and-filter-on-a-html-table). Many thanks to him! Credit where credit is due. I wouldn't feel comfortable implementing a solution I didn't understand, so in this post, I'll attempt to explain, step-by-step, what every element means. By the way, here is the full code that user dfsq posted on [JSFiddle](http://jsfiddle.net/dfsq/7BUmG/1133/) for reference. 

##The View
Sourcery is an educational resource-sharing app built on Rails, where users can create groups and add resources, usually articles or pdfs. So, for this post, I'll use the example of the *groups index* page to implement filtered RegEx search. 

![alt text](/images/groups-sourcery.png "Flatiron Follower Dashboard")


On the *groups index* page, we list all of the groups that have been made on the platform in a table. There are columns for name, description, and group options, and each row represents a single group. 

Now, since this is Rails, I've rendered each row as a partial. The code for table is as follows: 

```html
<table class="table table-striped filterable-table">
  <tr>
    <th class="col-md-4"><strong>Name</strong></th>
    <th class="col-md-4"><strong>Description</strong></th>
    <th class="col-md-4"><strong>Options</strong></th>
  </tr>
<% @groups.each do |group| %>
  <%= render partial: 'groups/group', locals: {group: group, current_user: current_user} %>
<% end %>
</table>
``` 
<!-- more -->

The table is styled using bootstrap classes of `table` and `table-striped`, but the `filterable-table` class I added myself to give the jQuery selector I'll explain in a bit something to latch onto. Within the partial, I've given each row a class of `resource-row-js` so that a) I know it's for JavaScript purposes and b) I can again select it using jQuery. 

The search form, which is really just an input box, looks something like this: 

```html
<div class="form-inline">
  <div class="form-group">
    <label for="filter">Search</label>
      <input type="text" class="filter form-control" placeholder="Type to filter">
  </div>
</div>
```
Most of the classes are for Bootstrap styling, but the class `filter` I added for jQuery. 

##The JavaScript

Okay, now onto the good stuff. This is the contents of the JavaScript file I'm loading to perform the filter. I invoke it upon `page:change` since [Turbolinks doesn't like to play nice all the time](http://talum.github.io/blog/2015/12/06/document-never-ready-blame-turbolinks/). 


```javascript
$(document).on("page:change", function(){
  resourceFilter();
})

function resourceFilter(){
  var $rows = $(".filterable-table tr.resource-row-js");
  
  $('.filter').keyup(function(){
    var val = '^(?=.*\\b' + $.trim($(this).val()).split(/\s+/).join('\\b)(?=.*\\b') + ').*$',
        reg = RegExp(val, 'i'),
        text;

  $rows.show().filter(function(){
    text = $(this).text().replace(/\s+/g, ' ');
    return !reg.test(text);
  }).hide();
  
  });
}
```

Within the `resourceFilter` function, a bunch of stuff is happening. Here we go, line by line, element by element. 

`var $rows = $(".filterable-table tr.resource-row-js");` selects all the rows with the class of `resource-row-js` within the table with a class of `filterable-table`. I tried to be ultra specific in case I used multiple tables on a page. 

Next up, we have some more jQuery. 

`$('.filter')` selects the input box, which I gave that specific class of `filter`. Then, the jQuery `.keyup()` method is used to catch the event when "the user releases a key on the keyboard," according to the [jQuery API documentation](https://api.jquery.com/keyup/).

So basically, after the user finishes typing, the `keyup` event is sent to the element (the input field), and the anonymous callback function is called. 

Now, what's happening in the callback function? Crazy stuff. I find RegEx the most difficult part of this search functionality, so forgive me if I screw this up (and let me know--gently--if I got something wrong so I can fix it.)

`var val = '^(?=.*\\b' + $.trim($(this).val()).split(/\s+/).join('\\b)(?=.*\\b') + ').*$',
        reg = RegExp(val, 'i'),
        text;`

Here, we're declaring the variables `val`, `reg`, and `text` all at once. The variable `val` is taking the input from the search form to create a search pattern for a regular expression. 

Working from the inside out, in this case, `$(this).val()` takes the text input from the search form. The `split` function takes that input and splits it on the white space delimiter to create an array. Then, the `join` function creates a string from that array and sticks a  `\b)(?=.*\b` between them. Values are also prepended and appended to the string. Afterward, the jQuery function [`trim`](https://api.jquery.com/jQuery.trim/) removes white space before and after the newly formed string. 

So, for example, if you enter the words "medical technology" in the search field, the final pattern produced to match would be `"^(?=.*\bmedical\b)(?=.*\btechnology).*$"`.

What I interpret this to mean is that for each word in the search, [positive lookahead regex groups](http://www.regular-expressions.info/lookaround.html) are formed. The positive lookahead is indicated by the characters *?=*. When strings are compared to this pattern, the ones that match the beginnings of any of the included phrases return true. To break down the expression further, the `\b` matches at a word boundary, enabling [whole words search only]([http://www.regular-expressions.info/wordboundaries.html). This search doesn't match words that include subsets of the patterns. The `\b` can be preceded by 0 or more of any characters, which is why even a word in a middle of a string can be matched. 

And that's my current interpretation of what's happening with RegEx here. 

Moving on, `reg = RegExp(val, 'i'),` creates a [RegExp object in JavaScript](http://www.w3schools.com/js/js_regexp.asp) with the parameter `i` indicating case insensitivity. On this RegExp object, certain methods, such as `test` can be called. 

In the next function, this is used to filter the rows of the table. 
```javascript 
$rows.show().filter(function(){
    text = $(this).text().replace(/\s+/g, ' ');
    return !reg.test(text);
  }).hide();
```
All the rows have been selected and `show` and `filter`, jQuery functions, are called on all of them. Then, for each row, the white space in the text is replaced globally with a space. Finally, the function returns all the rows that don't match the regex pattern previously defined, and hides them. 

And that's how I think the filter works on the table on the page. Hopefully I'll get more practice with RegEx over time, but until then, thank goodness for helpful people on the Internet.   


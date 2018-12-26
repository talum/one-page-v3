---
layout: post
title: "React Basics: A Simple Fitting Room Component"
date: 2017-07-04 17:47:24 -0400 
comments: true
categories: ["react", "javascript"]
---
![FittingRooms](https://s3-us-west-2.amazonaws.com/talum.github.io/fittingrooms.gif)
# React and Everything Amazing About It 

I've been writing apps in React for a little over eight months now, and I love
it. Although it may be difficult at first to dive into the React ecosystem
and learn all the important players, after you get the hang of it, you'll
see how easy it is to create dynamic, complex UIs quickly.

React itself is a simple view library, not a framework, which makes it easy
to customize your app, but difficult to get all the right pieces together
when you're first getting started. In order to take advantage of all the
benefits of React, you'll need to buy into the whole system and learn [ES6 syntax](https://babeljs.io/learn-es2015/),
[JSX](https://facebook.github.io/react/docs/introducing-jsx.html), and [React Router](https://github.com/ReactTraining/react-router).
Also helpful is learning a bit of [webpack](https://webpack.js.org/) and incorporating a library such
as [Redux](http://redux.js.org/) for state management. Once you get a production app running, you 
probably should use [Flow](https://flow.org/en/docs/getting-started/) or TypeScript to add typechecking to your app and prevent simple, yet annoying
JavaScript errors. 

In terms of state management, Redux seems to be the most popular choice at
the moment, and that's the one I've primarily focused on learning, but I've
also seen people use Alt and MobX. I've also seen apps that don't use a
state management library, including the software I worked on for the past
three months at Rent The Runway. As far as typechecking goes, I'm pro Flow
because it's easy to adopt incrementally and it's pretty simple to begin
using from the outset, but you can read more [here](http://dresscode.renttherunway.com/blog/flow-and-react).

If I had to identify the key features of React that make it so delightful,
it would likely be unidirectional data flow and a simple API, both of which
work together to encourage the creation of small, isolated components. In
this post, I'll cover my thought process regarding how to structure state
within my React components and how to create a simple component. This should
be suitable for beginners and up.

# Creating A Simple Component 

For context, I worked for the last three months on internal software for
retail stores. One of the requirements in the app I was building was for
stylists in the stores to be able to manage fitting rooms. This includes the
ability to add a customer to a fitting room, mark the fitting room as open,
and mark the fitting room as closed.

As I primarily focused on front-end work, I didn't need to worry too much
about how the data was getting to me, but I would need to hit an API to
fetch the list of fitting rooms and the list of customers.

When people write about React, they often talk about _thinking_ in React
because writing apps in React does require a different mental model than,
say, Backbone or just unstructured spaghetti jQuery. When you think about
composing components in React, you need to consider where the state will
live. Ideally, state would live in one place, your single source of truth,
and that state would be passed down into subcomponents as props. State is
mutable, but only by calling the method `setState` through the established API.

You should never, ever try to mutate state directly. That will not trigger a
re-render and will only leave you very confused about what state your app is
actually in.

That said, when structuring this part of the app, I decided that there
should be a `FittingRooms` component that would hit the backend API and
fetch the list of fitting rooms and that this component would render a list
of subcomponents called `FittingRoom`. In pseudocode, that would probably
look something like the following:

```javascript

// not real code! 

class FittingRooms extends React.Component {
  constructor(props) {
    // here we set the default state of the component so that it doesn't
    // blow up if the fitting rooms are null
    // flow would also advise us to set all the possible pieces of state
    this.state = {
      loading: true,
      fittingRooms: []
    }
  }

  componentDidMount() {
    // this is some API
    FittingRooms.fetch().then((data) => {
      this.setState({
        fittingRooms: data.fittingRooms,
        loading: false
      })
    })
  }

  render() {
    if (this.state.loading) {
      return <Spinner />
    }
    
    let fittingRooms = this.state.fittingRooms.map((fr) => <FittingRoom
    fittingRoom={fr}/>)

    return(
      {fittingRooms}
    )
  }
}


```

But for now, let's turn our attention to the actual `FittingRoom` component
itself.

The `FittingRoom` has three possible states: open, occupied, or closed.
Displaying this visually and controlling the behavior of each will need to
be accomplished through a mix of CSS and JavaScript. I prefer to use
JavaScript to calculate the state and then use CSS (with Sass and BEM syntax) to bring this UI to life.

All that a basic React component needs is a render method and to inherit
from `React.Component`. If you're using older syntax, you could use the
`React.createClass` interface, but I strongly advise everyone to get off
that and enter the modern era. 

```javascript

class FittingRoom extends React.Component {
  render() {
    return(<div/>)
  }
}

```
This component doesn't do much, but there's the beginning of what will soon
be a beautiful, fully functioning component representation of a Fitting
Room.

Now, let's start thinking about how to derive the state of the component. As
I mentioned above, fitting rooms can either be open, closed, or occupied.

To begin, I write two functions to determine the state of the fitting room.
If it's occupied, it'll have a fitting room ticket attached. If it's open,
it'll have an open status of true. And finally, if it's neither of those,
it'll be closed. 

```javascript
class FittingRoom extends React.Component {
  isOccupied (fittingRoom) {
    // here I use the lodash function to be sure I don't make a 
    // null-checking error.
    // it happens more often than I'd like to admit
    return !_.isEmpty(fittingRoom.fittingRoomTicket)
  }

  isOpen (fittingRoom) {
    return fittingRoom.open === true
  }

  render () {
    // Before the return keyword, you can do a bunch of calculations
    // used in the component
    if (this.isOccupied(fittingRoom)) {
      status = 'Occupied'
    } else if (this.isOpen(fittingRoom)) {
      status = 'Open'
    } else {
      status = 'Closed'
    }

    return (
      <div className={`FittingRoom FittingRoom--${status}`}>
        {status}
      </div>
    )
  }
}

```

Now, let's take it one step further and render different markup based on the
status of the component.

```javascript
class FittingRoom extends React.Component {
  isOccupied (fittingRoom) {
    return !_.isEmpty(fittingRoom.fittingRoomTicket)
  }

  isOpen (fittingRoom) {
    return fittingRoom.open === true
  }

  renderOccupiedFittingRoom (fittingRoom) {
    let customer = fittingRoom.fittingRoomTicket.customer

    return (
      <div className='FittingRoom__Container'>
        <div className='FittingRoom__Label'>
          {fittingRoom.label}
        </div>
        <div className='FittingRoom__Status'>
          {customer.firstName} {customer.lastName}
        </div>
      </div>
    )
  }

  renderFittingRoom (fittingRoom) {
    return (
      <div className='FittingRoom__Container'>
        <div className='FittingRoom__Label'>
          {fittingRoom.label}
        </div>
        <div className='FittingRoom__Status'>
          // check out this cool ternary statement
          {fittingRoom.open ? 'Open' : 'Closed'}
        </div>
      </div>
    )
  }

  render () {
    let {fittingRoom} = this.props
    // This is object destructuring syntax provided by ES6
    let status
    let fittingRoomComponent
    // Up here I'm declaring the variables that will later hold the markup
    // for the component

    if (this.isOccupied(fittingRoom)) {
      status = 'Occupied'
      fittingRoomComponent = this.renderOccupiedFittingRoom(fittingRoom)
    } else if (this.isOpen(fittingRoom)) {
      status = 'Open'
        fittingRoomComponent = this.renderFittingRoom(fittingRoom)
    } else {
      status = 'Closed'
      fittingRoomComponent = this.renderFittingRoom(fittingRoom)
    }

    return (
      <div className={`FittingRoom FittingRoom--${status}`}>
        // Down here I reference that variable, which is just another
        // component. Since it's JSX, it compiles down to JavaScript objects
        {fittingRoomComponent}
      </div>
    )
  }
}

```
Awesome, so now we've got our basic component, and it's time to style it.

# Atomic Design, SCSS, & BEM in Practice

Instead of using a CSS framework, here I am writing custom CSS for each
component and using BEM syntax to both namespace and identify each chunk of
the UI. 

Sprinkled throughout the component already you'll see various classNames
applied to each piece of the fitting room. At the top level of the component
is the block, the `FittingRoom`. Then, because each status has a different
look, I give that `FittingRoom` a modifier. That is denoted by the double
dashes `--`. In the end, we should have `FittingRoom--Open`,
`FittingRoom--Occupied`, and `FittingRoom--Closed`.

Each `FittingRoom` is composed of a `Label` and a `Status`. These are both
elements of the `FittingRoom`, and are indicated as elements by the double
underscores: `FittingRoom__Label` and `FittingRoom__Status`.

Here's what the stylesheet for this component looks like: 

```SCSS
.FittingRoom {
  font-family: Helvetica;
  text-align: center;
  background-color: #ffffff;
  width: 150px;
  color: #111111;
  margin: 4px;
  border: 1px solid #aaaaaa;
  border-top: 0 solid #aaaaaa;
  position: relative;

  &__Container {
    padding: 16px 16px 24px 16px;
  }

  &__Label {
    margin: 0 auto;
    font-size: 24px;
    padding: 4px;
    text-align: center;
    height: 32px;
    width: 32px;
    border-radius: 9999px;
    background-color: #aaaaaa;
    color: white;
  }

  &__Status {
    margin-top: 8px;
    padding: 8px 0;
    font-size: 18px;
  }

}

.FittingRoom--Open {
  color: #66A97A;
  .FittingRoom__Container {
    border-top: 8px solid #66A97A;
  }
  .FittingRoom__StatusBar {
    background-color: #66A97A;
  }
  .FittingRoom__Label {
    background-color: #66A97A;
  }
}

.FittingRoom--Occupied {
  .FittingRoom__Container {
    border-top: 8px solid #ff0000;
  }
  .FittingRoom__Label {
    background-color: #ff0000;
  }
}

.FittingRoom--Closed {
  color: #aaaaaa;
  .FittingRoom__Container {
    border-top: 8px solid #aaaaaa;
  }
  .FittingRoom__Label {
    background-color: #aaaaaa;
  }
}

```
As you can see, there's the main block, and then the extensions to indicate
each status. Nested within the extensions are the modifictions to the child
elements that need to be applied to achieve the styles we want.

And that's all for now! To see the code, check out this [Codepen example](https://codepen.io/talum/pen/LLrZRZ).


# Resources
- [JSX](https://facebook.github.io/react/docs/introducing-jsx.html)
- [ES6](https://babeljs.io/learn-es2015/)
- [React Router](https://github.com/ReactTraining/react-router)
- [Redux](http://redux.js.org/)
- [Flow](https://flow.org/en/docs/getting-started/)

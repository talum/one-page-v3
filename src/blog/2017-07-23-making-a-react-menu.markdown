---
layout: post
title: "Making a React Menu"
date: 2017-07-23T10:58:40-04:00
comments: true
categories: ["react", "javascript", "ES6"] 
---

![FittingRooms](https://s3-us-west-2.amazonaws.com/talum.github.io/fittingrooms.gif)

# Making a React Menu

When creating a menu of possible actions, the two hardest things to 
me are positioning the menu and handling the unfocused click to
close the menu. There are a number of ways to do this, but here's how I
ended up implementing a solution.

# CSS

First, when writing my own SCSS to style this menu, I had a couple
epiphanies. You'd think I'd know this by now, and maybe I did conceptually,
but it isn't until I had to focus solely on styling for a day or so that
I learned how CSS positioning actually works.

The big epiphany: `position:absolute;` positions the element relative to its
first positioned ancestor. You don't necessarily need to change that
element's positioning by using `top`, `left`, `right`, or `bottom` , but you
do need to add `position: relative;`. According to the docs, "first
positioned ancestor" just means the first ancestor that does not have static
positioning, which is the default.

I ended up with this for the outer menu container:

```scss
.FittingRoomActionsMenu {
  position:   absolute;
  top:        80%;
  left:       0%;
  height:     auto;
  z-index:    3;
}
```

This menu is a child of the `FittingRoom` div, which has a property of
`position: relative;`. Althought I don't end up making use of the full
position relative possibilities on the `FittingRoom` div and corresponding component, this allows me to consistently set where
the child menu will appear.

The markup for the component in JSX was structured like this:

```javascript
  <div className='FittingRoomActionsMenu'>
    <div className='FittingRoomActionsMenu__Arrow'>
      <div className='FittingRoomActionsMenu__InnerArrow' />
    </div>
    <ul className='FittingRoomActionsMenu__Body'>
      <li className='FittingRoomActionsMenu__Body__Item' onClick={this.props.adjustFittingRoom}>
        {this.props.adjustFittingRoomText}
      </li>
    </ul>
  </div>
```

Where this really gets fun is when you also have some other elements to
style and position, such as an arrow to indicate to which fitting room the
menu belongs. Following BEM syntax, I created an "arrow" and "inner
arrow" denoted as children of the actions menu by the double underscores. The inner, white arrow,
overlaps with the outer, grey arrow, to accomplish a border effect. The code
for that looked like this.

```scss
.FittingRoomActionsMenu {
  position:   absolute;
  top:        80%;
  left:       0%;
  height:     auto;
  z-index:    3;

  &__Arrow {
    position:      absolute;
    top:           -16px;
    left:          0px;
    width:         0;
    height:        0;
    border-left:   16px solid transparent;
    border-right:  16px solid transparent;
    border-bottom: 16px solid $grey-lighter;
  }

  &__InnerArrow {
    position:      absolute;
    top:           1px;
    left:          -15px;
    width:         0;
    height:        0;
    border-left:   15px solid transparent;
    border-right:  15px solid transparent;
    border-bottom: 15px solid $white;
  }
```

From there, styling the body and inner items were relatively simple. I
created a few more children in the div and let their position follow the
natural flow.

```scss
.FittingRoomActionsMenu {
  position:   absolute;
  top:        80%;
  left:       0%;
  height:     auto;
  z-index:    3;

  &__Arrow {
    position:      absolute;
    top:           -16px;
    left:          0px;
    width:         0;
    height:        0;
    border-left:   16px solid transparent;
    border-right:  16px solid transparent;
    border-bottom: 16px solid $grey-lighter;
  }

  &__InnerArrow {
    position:      absolute;
    top:           1px;
    left:          -15px;
    width:         0;
    height:        0;
    border-left:   15px solid transparent;
    border-right:  15px solid transparent;
    border-bottom: 15px solid $white;
  }

  &__Body {
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    background-color: $white;
    list-style: none;
    padding:    0;
    margin:     0;

    &__Item {
      font-size:     16px;
      color:         $grey-dark;
      padding:       16px;
      border-bottom: 1px solid $grey-lightest;
      &:hover {
        background-color: $grey-faint;
      }
    }
  }
}
```
And thus, the menu was styled.

# Handling an Unfocused Click

But now, onto the focused click. In a lot of other implementations, I've
seen people throw a transparent div on the DOM to catch unfocused clicks,
but I couldn't figure out an elegant way to do that consistently. Instead, I
stumbled upon [this answer](https://stackoverflow.com/questions/32553158/detect-click-outside-react-component) on StackOverflow, which came up with a different solution.

Essentially, you set a wrapper div as a property of the component and add an
event handler on the component to intercept all clicks while that component
is mounted on the DOM. Then, you check if the wrapper contains the event,
and if it does, you let it do its thing. If it doesn't, you call a function
to close the menu, or whatever behavior you want.

Here's an example with annotations:

```javascript
class FittingRoomActionsMenu extends Component {
  constructor (props) {
    super(props)

    // In the constructor of the component, we set the wrapper ref.
    // The argument for this function is the DOM node itself.
    this.setWrapperRef = this.setWrapperRef.bind(this)
    // Here we bind the function to guarantee that `this` will be the
    //`FittingRoomActionsMenu`
    this.handleClickOutside = this.handleClickOutside.bind(this)
  }

  componentDidMount () {
    // As soon as the component mounts, set up the event listener
    document.addEventListener('mousedown', this.handleClickOutside)
  }

  componentWillUnMount () {
    // And don't forget to remove the listener when the component unmounts
    document.removeEventListener('mousedown', this.handleClickOutside)
  }

  setWrapperRef (node) {
    this.wrapperRef = node
  }

  handleClickOutside (event) {
    // THIS ALLOWS THE TOGGLE TO REMAIN FUNCTIONAL WHEN THE MENU IS OPEN
    // Here I'm using lodash to help me figure out whether the event occurred
    // within the component
    // The only problem here is that as long as there is more than one
    // `.FittingRoom`, more than one menu can also be on the DOM.
    // In other words, clicking on another fitting room will open another
    // menu instead of closing the currently open one.
    let toggles = Array.prototype.slice.call(document.querySelectorAll('.FittingRoom'))
    if (this.wrapperRef && !this.wrapperRef.contains(event.target) && !toggles.some((t) => t.contains(event.target))) {
      // Anyway, if the event happened outside, we toggle the menu.
      this.props.toggleActionsMenu()
    }
  }

  render () {
    return (
      <div ref={this.setWrapperRef}>
        <div className='FittingRoomActionsMenu'>
          <div className='FittingRoomActionsMenu__Arrow'>
            <div className='FittingRoomActionsMenu__InnerArrow' />
          </div>
          <ul className='FittingRoomActionsMenu__Body'>
            <li className='FittingRoomActionsMenu__Body__Item' onClick={this.props.adjustFittingRoom}>
              {this.props.adjustFittingRoomText}
            </li>
          </ul>
        </div>
      </div>
    )
  }
}
```

To wrap up, we now have a cool-looking menu that toggles closed on an
unfocused click.


# Resources
- [Detect Click Outside React Component](https://stackoverflow.com/questions/32553158/detect-click-outside-react-component)


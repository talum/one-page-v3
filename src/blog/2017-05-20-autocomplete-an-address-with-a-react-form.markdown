---
layout: post
title: "Autocomplete an Address with a React Form"
date: 2017-05-20T13:38:14-04:00
comments: true
categories: ['react', 'google maps']
---

# Autocomplete
One neat feature you can incorporate into a form that requires an address is
[Google Place Autocomplete for Addresses and Search Terms](https://developers.google.com/maps/documentation/javascript/places-autocomplete). Using the Google Maps API, it's pretty easy
to implement autocomplete to speed up address entry and address entry
accuracy, but using it with React presents a few challenges.

Here's an example of using the autocomplete feature in a form.

![Autocomplete in Action](https://s3-us-west-2.amazonaws.com/talum.github.io/autocomplete-demo.gif)

# Setup 
In order to use the Google Maps API, you'll need a developer key. Follow
the instructions [here](https://developers.google.com/places/web-service/get-api-key) to get one. Apparently, it's okay if you expose your key publicly because you can also limit the IP addresses that can use your key to make requests. Keep that in mind because a future step exposes your key and you might find that weird and/or dangerous. Probably mostly weird if you're just doing a hobby project as I am. Anyway, follow the instructions to enable the places service through the Google Maps API found [here](https://developers.google.com/maps/documentation/javascript/places-autocomplete). This part is fairly straightforward.

Next you'll need to load the library in your app. I wasn't a big fan of just
loading this into the global namespace, but when I tried importing it
through npm, that didn't work so well because the package I tried to use was
built for server-side use only. So, I went ahead and loaded it
top-level, as the instructions suggest. I know, the key feels weirdly
exposed.

# The Component
Once that's done, you can move onto building your component and
incorporating autocomplete into it.

The API provides two classes of autocomplete widgets, `Autocomplete` and
`SearchBox`. I ended up using the `Autocomplete` one within my ice cream
app, [Creamery](https://ice-creamery.herokuapp.com).

Let's say I have a basic `ParlorForm` component. This is what I'm using to
add new ice cream parlors to my application. It'll look a little something
like this to begin. I'm using ES6 and JSX, by the way, as all the cool kids
do these days. Within my app, I'm also using Redux, but in the example below
  I've removed most of the references, so hopefully you can just interpret
  and trust the pseudo-code.

```javascript
import React from 'react'

class ParlorForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = this.initialState()
    // this is to set the initial state of the component
    this.handleChange = this.handleChange.bind(this)
    // as you probably
    // know, if you're going to be passing functions around and invoke them as
    // callbacks, you'll need to hold onto 'this' because it's bound at runtime
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  initialState() {
    // woohoo, just an object that represents an empty parlor
    return {
      name: '',
      street_address: '',
      city: '',
      state: '',
      zip_code: '',
      googleMapLink: ''
    }
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value})
  }

  handleSubmit(event) {
    event.preventDefault()
    this.props.dispatch(addParlor(this.state))
    // this is just some redux.
    // just trust that it does what it's supposed to do,
    // send an ajax request to my server
  }

  render() {
    return(
      <div>
        <h1>Add New Parlor</h1>
        <form onSubmit={this.handleSubmit}>
          <input id="autocomplete"
            className="input-field"
            ref="input"
            type="text"/>
            // this is the input field used specifically for autocomplete
            // note that it doesn't respond to changes in state, 
            // nor does it change state
            // it's just talking to the Google Maps API
            // I've given it an id so we can reference it when we
            // instantiate the Google Autocomplete box
            <input 
              name={"name"}
              value={this.state.name}
              placeholder={"Name"}
              onChange={this.handleChange}
            />
            <input 
              name={"street_address"}
              value={this.state.street_address}
              placeholder={"Street Address"}
              onChange={this.handleChange}
            />
            <input 
              name={"city"}
              value={this.state.city}
              placeholder={"City"}
              onChange={this.handleChange}
            />
            <input
              name={"state"}
              value={this.state.state}
              placeholder={"State"}
              onChange={this.handleChange}
            />
            <input 
              name={"zip_code"}
              value={this.state.zip_code}
              placeholder={"Zipcode"}
              onChange={this.handleChange}
            />
            <button onSubmit={this.handleSubmit}>Submit</button>
        </form>
      </div>
    )
  }

}

export default ParlorForm
```

Cool, so that's a pretty basic component that responds to changes of each
input's value. Every time you type something into one of the inputs,
`handleChange`will get called, which resets the state of the component.

The update value of each input will be reflected since I've set the value
property of each input equal to the value of the property in the component's
state.

Now, onto the fun stuff! Address autocomplete.

First, let's set a property of `autocomplete` to `null` within the
`constructor` function. Mostly this is just for clarity, because we'll reset
this once the component mounts.

```javascript
  constructor(props) {
    ...
    this.autocomplete = null
  }
```

Next, we'll "instantiate" a new autocomplete box within the
`componentDidMount` lifecycle method. Basically, just setting the property
of `autocomplete` equal to a new autocomplete object. This object emits an
event of `place_changed` when a user selects a place, so I'm also adding a
listener to that event, along with a callback.

Notice that to listen for the event, I need to use the [`addListener`](https://developers.google.com/maps/documentation/javascript/events)
function provided by the Google Maps JavaScript API, not the traditional
`addEventListener` provided by JavaScript. This contrasts from typical
React behavior, where you simply provide a callback as a prop to an element since React
has its own synthetic events and event handlers.

```javascript
  componentDidMount() {
    this.autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete'), {})

    this.autocomplete.addListener("place_changed", this.handlePlaceSelect)
  }
```
The constructor for the `Autocomplete` box accepts the element that should
be 'autocompleted', as well as a config object. There are plenty of configs,
such as limiting the bounds for search, but I don't need any of those, so
we're skipping it!

Great, now let's turn our attention to handling the place selection.
Already, I've named the callback function `handlePlaceSelect`. I'll add a
bound version of this function into the constructor, just to make sure we're
using the right `this`.

Here's the implementation of `handlePlaceSelect`. The idea here is to call
the `getPlace` function on the `autocomplete` object in order to extract
details about the selected place. Because this is a callback in response to
an event, we should get the right information returned from the Google Maps
API.

```javascript
  handlePlaceSelect() {
    let addressObject = this.autocomplete.getPlace()
    let address = addressObject.address_components
    this.setState({
      name: addressObject.name,
      street_address: `${address[0].long_name} ${address[1].long_name}`,
      city: address[4].long_name,
      state: address[6].short_name,
      zip_code: address[8].short_name,
      googleMapLink: addressObject.url
    })
  }
```

Above, I'm extracting the address details from the response. There's plenty
of more information, but this is all I need for my parlor form.

And that's all there is to implementing autocomplete simply. Here's the full
code for the component.

```javascript
import React from 'react'

class ParlorForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = this.initialState()
    this.handlePlaceSelect = this.handlePlaceSelect.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.autocomplete = null
  }

  componentDidMount() {
    this.autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete'), {})

    this.autocomplete.addListener("place_changed", this.handlePlaceSelect)
  }

  initialState() {
    return {
      name: '',
      street_address: '',
      city: '',
      state: '',
      zip_code: '',
      googleMapLink: ''
    }
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value})
  }

  handleSubmit(event) {
    event.preventDefault()
    this.props.dispatch(addParlor(this.state))
    this.clearForm()
  }

  handlePlaceSelect() {
    let addressObject = this.autocomplete.getPlace()
    let address = addressObject.address_components
    this.setState({
      name: addressObject.name,
      street_address: `${address[0].long_name} ${address[1].long_name}`,
      city: address[4].long_name,
      state: address[6].short_name,
      zip_code: address[8].short_name,
      googleMapLink: addressObject.url
    })
  }

  render() {
    return(
      <div>
        <h1>Add New Parlor</h1>
        <form onSubmit={this.handleSubmit}>
          <input id="autocomplete"
            className="input-field"
            ref="input"
            type="text"/>
            <input 
              name={"name"}
              value={this.state.name}
              placeholder={"Name"}
              onChange={this.handleChange}
            />
            <input 
              name={"street_address"}
              value={this.state.street_address}
              placeholder={"Street Address"}
              onChange={this.handleChange}
            />
            <input 
              name={"city"}
              value={this.state.city}
              placeholder={"City"}
              onChange={this.handleChange}
            />
            <input
              name={"state"}
              value={this.state.state}
              placeholder={"State"}
              onChange={this.handleChange}
            />
            <input 
              name={"zip_code"}
              value={this.state.zip_code}
              placeholder={"Zipcode"}
              onChange={this.handleChange}
            />
            <button onSubmit={this.handleSubmit}>Submit</button>
        </form>
      </div>
    )
  }

}

export default ParlorForm
```

# Notes
You could also use the [Google Places API](https://developers.google.com/places/web-service/autocomplete) and parse the results yourself, but I personally liked the simplicity of using the places library through the Maps API. Also, if you know of a better way to do this, please let me know!

# Resources
- [Google Maps API Autocomplete](https://developers.google.com/places/web-service/autocomplete)
- [Google Places API]( https://developers.google.com/maps/documentation/javascript/places-autocomplete)

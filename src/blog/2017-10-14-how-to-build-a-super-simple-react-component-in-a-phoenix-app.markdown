---
layout: post
title: "How to Build a Super Simple React Component in a Phoenix App"
date: 2017-10-14T14:05:34-04:00
comments: true
categories: ["react", "phoenix"]
---

# Phoenix + JS

The Phoenix framework ships with Brunch, an easy-to-use asset build tool. If
you're building fairly straightforward front-ends, Brunch works pretty much
flawlessly out of the box. For more complex projects that involve custom
configuration, you'd probably want a more robust asset build tool, such as
Webpack. 

For the [Commits](http://github.com/talum/commits) project I built, which
surfaces the commit messages of a former colleague through a simple web
interface, I did nearly nothing to get it to work. And it was awesome! So
let's walk through what I did.

# The Dependencies
First, if you open up the `commits` project, you'll notice that the assets
are located within the assets directory. (Shocker, I know.)

To get Brunch to work with Babel, I cd'd into the `assets` directory and ran
the command `npm install --save-dev babel-brunch`. Then, inside of that directory is a
`brunch-config.js` file to which I added only the `react` and `es2015`
presets within the babel plugin configuration:

```javascript
plugins: {
babel: {
    ignore: [/vendor/],
    presets: ['react', 'es2015']
  }
}

```

If you're unfamiliar with Babel, it's a JavaScript compiler that allows you
to write JavaScript in different syntaxes, like ES6 or JSX. It'll turn your
code into regular old JavaScript, so that browsers will be able to interpret
it. By using different plugins, you'll be able to write different flavors of
JavaScript. Modern browsers for the most part are supporting ES6 syntax now,
but just for funsies and more browser compatibility, I kept that plugin.

Great, so from there, I added a few packages to my project.

`npm install --save axios react babel-preset-react react-dom
react-mousetrap`

[Axios](https://github.com/axios/axios) is a Promise-based HTTP client for
the browser. You could use the browser's native `fetch` API, but...why? Over
at Flatiron School, we've had a long-running debate about which to use, and
I've consistently been pro `axios`. But if you really want to go native, see
these [docs](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) and
keep resolving promises for the rest of your life.

React, babel-preset-react, and react-dom are all libraries that allow you
to write React components in JSX and get them to render to the DOM.

[React Mousetrap](https://github.com/blacktangent/react-mousetrap) is a fun
higher-order component that allows you to easily add keyboard shortcuts to
your app. 

# The App Component

After that initial setup, we're all ready to write some JavaScript! For this
particular project, the CSS wasn't that exciting, but if you really want to
check it out, it's all in `/assets/css/app.css`. But anyway, here's the fun
part.

The entry point to the app is `/assets/js/app.js`, which is the main script
that gets included on the Phoenix layout template,
`/lib/commits_web/templates/layout/app.html.eex`.

Inside that entry file, I import the required libraries and then render the
main component inside a div with an id of `app`.

```javascript
// assets/js/app.js
import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'

ReactDOM.render(<App />, document.getElementById('app'))
```

What controls the message that gets displayed is the `App` component. To
start, I wrote up a basic component that has its own local state. Note that
I'm not using Redux at all in this app because the state is so simple, and
to use Redux here would probably be overkill. A first pass of the code, with
annotations, follows.

```javascript
class App extends React.Component {
  constructor(props) {
    super(props)
    // Here I explicitly set the initial state of the component
    this.state = {
      loading: true,
      messages: [],
      currentMessageIndex: null,
    }
    // This is a common convention in React. What we're doing here is
    // returning a new function that has the right context for "this". Since
    // this function will be invoked in a callback later, we need to make sure
    // that "this" still refers to the `App` object.
    this.changeIndex = this.changeIndex.bind(this)
  }

  componentWillMount() {
    // This function comes from the mousetrap library
    // What I'm doing is invoking the function this.changeIndex as a
    // callback when the spacebar is pressed.
    this.props.bindShortcut('space', this.changeIndex)
  }

  componentDidMount() {
    // When the component mounts, I'm asking the backend to return ALL the
    // commit messages in the database. That may seem like a lot, but it
    // doesn't actually take that long, and this was simpler.
    axios.get('/api/commit_messages').then((data) => {
      // Oh gosh, yeah, this is how I structured the payload on the backend.
      const messages = data.data.data
      // Once the Promise resolves with the data, I put that data into the
      // state of the component and generate a random number from 0 to the
      // number of total messages
      this.setState({
        messages: messages,
        currentMessageIndex: this.generateRandomNumber(messages),
        loading: false
      })
    })
  }

  generateRandomNumber(messages) {
   return Math.floor(Math.random() * messages.length)
  }

  changeIndex() {
    // Whenever the spacebar is pressed or the text is clicked, the index
    // will reset so we can see a new message
    this.setState({
      currentMessageIndex: this.generateRandomNumber(this.state.messages),
    })
  }

  render() {
    // If there are no messages yet, I just return nothing
    if (this.state.loading) { return null }

    return(
      <div onClick={this.changeIndex}>
        <div>
          <h2>{ this.state.messages[this.state.currentMessageIndex].content }</h2>
        </div>
      </div>
    )
  }
  
  // At the bottom of the file I export the App component wrapped in the
  // higher-order mouseTrap component
  export default mouseTrap(App)
```

Then, to make things a little more splashy, I started picking a random color
scheme that would also switch when the message switched. A little
refactoring and reorganizing facilitated this. Instead of using CSS here,
I'm putting inline styles right into JSX.

First, for simplicity, I defined a set of color schemes as a constant at the
top of my file. Many of these I pulled from [coolors](https://coolors.co/).

```javascript
const colorSchemes = [
  {
    backgroundColor: '#062F4F',
    headingColor: '#4ABDAC',
  },
  { backgroundColor: '#EA526F',
    headingColor: '#FCEADE'
  },
  { backgroundColor: '#171738',
    headingColor: '#DFF3EF'
  },
  { backgroundColor: '#272932',
    headingColor: '#72B01D'
  },
  { backgroundColor: '#72B01D',
    headingColor: '#001D4A'
  },
  { backgroundColor: '#103900',
    headingColor: '#0FFF95'
  },
  { backgroundColor: '#1D1E2C',
    headingColor: '#DDBDD5'
  },
  { backgroundColor: '#59656F',
    headingColor: '#F7EBEC'
  },
  { backgroundColor: '#292F36',
    headingColor: '#FF6B6B'
  },
  { backgroundColor: '#373F51',
    headingColor: '#DAA49A'
  },
  { backgroundColor: '#424242',
    headingColor: '#FCFC62'
  }
]
```

Next, I pretty much generated another random number that would serve as the
color scheme index and also added a default value to initial state. To get
the styling right for the entire container, I also introduced a new `Main`
component that would be able to control the colors of the entire page while
also correctly positioning the commit message in the center of the page.
Since that `Main` component should also render when the messages are still
loading, I decided to pass child props to that component to render. This
way, when the messages are ready, I can render the selected message;
otherwise, I can render a CSS loading animation. Here's what the code looked
like after this changes.

```javascript
import React from 'react'
import axios from 'axios'
import { mouseTrap } from 'react-mousetrap'

const colorSchemes = [
  {
    backgroundColor: '#062F4F',
    headingColor: '#4ABDAC',
  },
  { backgroundColor: '#EA526F',
    headingColor: '#FCEADE'
  },
  { backgroundColor: '#171738',
    headingColor: '#DFF3EF'
  },
  { backgroundColor: '#272932',
    headingColor: '#72B01D'
  },
  { backgroundColor: '#72B01D',
    headingColor: '#001D4A'
  },
  { backgroundColor: '#103900',
    headingColor: '#0FFF95'
  },
  { backgroundColor: '#1D1E2C',
    headingColor: '#DDBDD5'
  },
  { backgroundColor: '#59656F',
    headingColor: '#F7EBEC'
  },
  { backgroundColor: '#292F36',
    headingColor: '#FF6B6B'
  },
  { backgroundColor: '#373F51',
    headingColor: '#DAA49A'
  },
  { backgroundColor: '#424242',
    headingColor: '#FCFC62'
  }
]

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      messages: [],
      currentMessageIndex: null,
      colorSchemeIndex: 0
    }
    this.changeIndex = this.changeIndex.bind(this)
  }

  componentWillMount() {
    this.props.bindShortcut('space', this.changeIndex)
  }

  componentDidMount() {
    axios.get('/api/commit_messages').then((data) => {
      const messages = data.data.data
      this.setState({
        messages: messages,
        currentMessageIndex: this.generateRandomNumber(messages),
        loading: false
      })
    })
  }

  generateRandomNumber(messages) {
   return Math.floor(Math.random() * messages.length)
  }

  generateRandomColorSchemeIndex() {
    return Math.floor(Math.random() * colorSchemes.length)
  }

  changeIndex() {
    this.setState({
      currentMessageIndex: this.generateRandomNumber(this.state.messages),
      colorSchemeIndex: this.generateRandomColorSchemeIndex()
    })
  }

  render() {
    // Here I'm reading the index from state and finding the corresponding
    // colorScheme from the constant I defined at the top
    let backgroundColor = colorSchemes[this.state.colorSchemeIndex].backgroundColor
    let headingColor = colorSchemes[this.state.colorSchemeIndex].headingColor

    // Now, if the messages aren't ready yet, I'm jsut going to pop a
    // spinner on the page
    if (this.state.loading){
      return (
        <Main {...this.props}>
          <div className="spinner">
            <div className="rect1"></div>
            <div className="rect2"></div>
            <div className="rect3"></div>
            <div className="rect4"></div>
            <div className="rect5"></div>
          </div>
        </Main>
      )
    }

    // Otherwise, if everything's loaded let's go ahead and show a message
    return(
      <Main {...this.props} backgroundColor={backgroundColor}>
        <div className='level' onClick={this.changeIndex}>
          <div className='level__inner'>
            <h2 className='heading heading--level-1 util--text-align-c' style={{color: headingColor}}>{ this.state.messages[this.state.currentMessageIndex].content }</h2>
          </div>
        </div>
      </Main>
    )
  }
}

// This Main component is a functional component because it doesn't have its
// own local state and we have no real use of lifecycle methods here. It
// takes simply props as its argument
const Main = (props) => {
  return(
    <main className='body' role='main' style={{backgroundColor: props.backgroundColor}}>
      <div className='flex-container'>
        <div className='flex__item'>
          <div className='level level--padding-short'>
            <div className='level__inner'>
              <h1 className='heading heading--level-2 util--text-align-c'>Commits by Logan</h1>
            </div>
          </div>
        </div>
        <div className='flex__item'>
          {props.children}
        </div>
        <div className='flex__item'>
          <div className='level'>
            <div className='level__inner'>
              <h3 className='heading heading--level-3 util--text-align-c'>Press the spacebar or tap the text to get a new message</h3>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

// Again, we export the wrapped version of the App component
export default mouseTrap(App)

```

And that was it! Just a simple React component that responds to spacebar
presses and also renders some *hilarious* commit messages. See it in action
[here](https://commits-by-logan.herokuapp.com/).

# Resources
- [Phoenix Static Assets](http://phoenixframework.org/blog/static-assets)
- [Brunch](http://brunch.io/)
- [Babel](https://babeljs.io/)

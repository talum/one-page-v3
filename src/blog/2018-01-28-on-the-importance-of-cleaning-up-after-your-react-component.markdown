---
layout: post
title: "On the Importance of Cleaning Up After Your React Component"
date: 2018-01-28 11:40:41 -0500 
comments: true
categories: ["react"]
---

For the past few months, I've been working on/leading a pretty large feature
generically named "Assignments." It provides the ability for any admin on
our platform, [Learn](https://learn.co), to give a student something to do.
That sounds simple enough in theory, but we had to build this feature with a lot
of flexibility.

Each assignment is due at a certain time and can have
several collaborators who are also admins on Learn. In addition, each assignment has
multiple tasks that have many types. For example, a task can be either a
code challenge or a to-do, can have a submission type of url or checkbox,
and can have a reviewable type of none, confirmed, or graded.

The abundance of types makes this project unwieldy. That and the conflation
of task with assignment because although we were designing this system to be
generic, the primary immediate use case (for code challenges) was incredibly
specific. I'm not quite convinced that we handled the types sustainably, but
it suffices for now. As the credo goes, make it work, make it right, make it
fast. We definitely made it work...so I'm okay with that.

Here are some sick gifs from our QA pass of the feature for your viewing pleasure.

### Admin Assignments Dashboard and Editor
![Admin Assignments](https://s3-us-west-2.amazonaws.com/talum.github.io/assignmentsadmin.gif)

### Student Assignment Submission
![Student Assignment](https://s3-us-west-2.amazonaws.com/talum.github.io/assignmentssubmission.gif)

### Admin Assignments Grading
![Admin Assignments Grading](https://s3-us-west-2.amazonaws.com/talum.github.io/admingradeassignment.gif)

Anyway, the feature has a React-Redux front end and a Rails backend. We
designed the backend using domain-driven design (DDD), and as a result, in
many places, the backend feels more like the Phoenix framework than Rails.
By the way, Rails gets super angry about autoloading when you heavily
namespace. And when Rails gets angry, I also get angry, well, more
frustrated than angry.

## The Problem
There are a ton of complex views that need varying amounts of data. But one
issue that kept cropping up repeatedly while we built this feature was that
we kept forgetting to clear out the old assignment data when our routes and
views changed.

We're using React Router to manage routes in our front-end app. This allows
us to display different components when the routes change, or, in other
words, maintain state in the URL. But, when you try to render two different
components based on the state of a data at the same URL, things can get
tricky.

To illustrate the problem, I'll point to a specific case I recently solved.
When an assignment is in a draft state, it's URL is basically
`BASE_URL/assignments/:id`, where the id is the primary key of the
assignment record. However, after the assignment is published, the URL
stays the same, but we instead display a grading view of the assignment
rather than the editing view. One URL: two very different components.

To determine which view we display, we need to know some information about the
assignment. However, we won't know that information at the time the
component renders because we have to ask the backend for that data.

I thought about this for a long time and the simplest solution I could think
of was to have a component that renders and mediates which component to
display: the `Editor` component or the `Grading` component. I also tossed
around the idea of having the grading portion live at a different URL, but
that became a little unwieldy because the grading view has another two
subviews that we display: an overview as well as a master-detail view.

So, I started with creating a new component I titled the
`AssignmentDirector`.

Here's a snippet from the pack file where our primary routes are declared:

```javascript
  render((
    <Provider store={ store } >
      <Router basename='/admin/assignments'>
        <Switch>
          <Route path='/:id(\d+)/:activeTab?' component={ AssignmentDirector } />
          <Redirect from='*' to='/search/assignments' />
        </Switch>
      </Router>
    </Provider>
  ), assignmentsContainer)

```

When the route matches, we render the `AssignmentDirector` component, and we
don't yet have the data we need. Even
those few microseconds of waiting can throw an error in the view.

The `AssignmentDirector` component below is a Redux-connected component
reponsible for determining which sub-component to display.

```javascript

class AssignmentDirector extends Component {
  componentDidMount() {
    const { fetchAssignment, history } = this.props
    const { id } = this.props.match.params

    fetchAssignment(id)
      .catch(e => history.replace('/search/assignments'))
  }

  componentDidUpdate(prevProps) {
    const { fetchAssignment, history } = this.props
    const { id } = this.props.match.params

    if (prevProps.match.params.id !== id) {
      fetchAssignment(id)
        .catch(e => history.replace('/search/assignments'))
    }
  }

  render() {
    if (this.props.loading) {
      return <Spinner containerHeight={125}/>
    }

    if (this.props.published) {
      return <GradingContainer
        history={this.props.history}
        id={this.props.match.params.id}
      />
    }

    return (
      <EditorContainer
        activeTab={this.props.match.params.activeTab}
        history={this.props.history}
      />
    )
  }
}

const mapStateToProps = ({assignments}) => {
  return {
    assignment: assignments.editor.active,
    publishAssignmentModalOpen: assignments.editor.publishAssignmentModalOpen
  }
}

export default connect(mapStateToProps, {fetchAssignment})(AssignmentDirector)

```

When the `AssignmentDirector` component mounts, we ask the backend for
information on that assignment. If it doesn't exist or throws an error, we
redirect to the dashboard's home. While that assignment is fetching, we
display a loading indicator. When the assignment data is received, we flip
the loading key to false and because the props have changed, the component
re-renders. As you might be able to tell, the `AssignmentDirector` is
reading its state from the `editorReducer`.

In the render function, the next set of logic should execute. If the
assignment is published, we render the `GradingContainer`. Otherwise, we'll
render the `EditorContainer`.

One complication is that the fetching of the assignment actually returns all
the data required for the `Editor` but not the `Grader`. In a perfect world,
we'd probably rewrite that, but to cut down on network requests, I think
this works for the time being.

So once again, if the assignment is published, we render the `GradingContainer`, which then
issues a request to get the grading summary for the assignment. That request
updates a different key in our redux store and is actually handled by the
`graderReducer` rather than the `editorReducer`.

```javascript
// editorReducer.js

export default (state = defaultState, action) => {
  const { type, payload } = action
  const { active } = state

  switch (type) {
    case RECEIVE_ASSIGNMENT:
      return { ...state,
        active: payload,
        loading: false,
      }

```

Here, the `editorReducer` responds to the `RECEIVE_ASSIGNMENT` action and
updates state accordingly.

Let's say that when this assignment was received, it was actually published.
In that case, the `GradingContainer` would render.

For simplicity, I'm only showing part of the component's code.

```javascript
// GradingContainer

class GradingContainer extends Component {
  componentDidMount() {
    const { id, fetchAssignmentGradingSummary, history } = this.props
    fetchAssignmentGradingSummary(id, history)
  }

  componentWillUnmount() {
    this.props.clearActiveStudent()
    this.props.clearAssignmentGradingSummary()
  }

  render() {
    return (
      //some markup
    )
  }
}

const mapStateToProps = ({
  assignments: {
    grader: {
      gradingSummary: {
        assignment
      },
      gradingSummaryLoading
    }
  }
}) => ({
  assignment,
  gradingSummaryLoading
})

export default withRouter(connect(mapStateToProps, {
  clearActiveStudent,
  clearAssignmentGradingSummary,
  fetchAssignmentGradingSummary
})(GradingContainer))

```

So, when the `GradingContainer` mounts, we dispatch an action to fetch the
grading data. That action eventually updates the state in `graderReducer`.

```javascript
// graderReducer

export default (state = defaultState, { type, payload }) => {
  switch (type) {
    case RECEIVE_ASSIGNMENT_GRADING_SUMMARY:
      return {
        ...state,
        gradingSummaryLoading: false,
        gradingSummary: {
          ...payload
        }
      }
  }
}
```
Now, when the `GradingContainer` unmounts, you see that I was smart enough
to remember to clean up the data in the store, but the `AssignmentDirector`
is still hooked up to the `editorReducer` and looking at the state of the
assignment in there.

This discrepancy resulted in odd behavior on the front end. When you clicked
on a published assignment from the dashboard and then clicked onto an
unpublished one, you'd momentarily see a flash of the grading view before
the assignment fetch resolved. You'd also see a 500 request appear in the
console.

I spent some time hanging out in the Redux Dev Tools inspector and noticed
that the `FETCH_STUDENT_ASSIGNMENT_GRADING_SUMMARY` kept getting called
before the `FETCH_ASSIGNMENT` action. Even though the URL was changing, the
`AssignmentDirector` was still trying to render the `GradingContainer`!

And that's when I realized that the
`AssignmentDirector` wasn't getting updated in the right order when the
assignment and URL changed.

To fix this, I added an action to clear the active assignment from the
`editorReducer` when the `AssignmentDirector` unmounts, which reset the
defaults for the assignment and the loading state within the
`editorReducer` and stop the `GradingContainer` from rendering prematurely.

```javascript
  componentWillUnmount() {
    this.props.clearActiveAssignment()
  }
```

And that, friends, is why it's important to clean up after your React
components.





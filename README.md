# React Components using Classes

There are three main problems that the React team were trying to solve with the additon of Hooks. Their [motivation](https://reactjs.org/docs/hooks-intro.html#motivation) is described in detail in their documentation.

- [It’s hard to reuse stateful logic between components](https://reactjs.org/docs/hooks-intro.html#its-hard-to-reuse-stateful-logic-between-components), but _Hooks allow you to reuse stateful logic without changing your component hierarchy_.
- [Complex components become hard to understand](https://reactjs.org/docs/hooks-intro.html#complex-components-become-hard-to-understand), but _Hooks let you split one component into smaller functions based on what pieces are related_.
- [Classes confuse both people and machines](https://reactjs.org/docs/hooks-intro.html#classes-confuse-both-people-and-machines), so removing them might allow us to do more with tooling.

Overall _Hooks let you use more of React’s features without classes_.

We still need to learn more about them, since a lot of older code bases will have legacy code that was written using the Class keyword. Other than the use of [Error Boundaries](https://reactjs.org/docs/error-boundaries.html) which is not a core feature of React, we should make all of our new components funtion based.

## Classes in ECMAScript

The `Class` keyword was officially added to ECMAScript in 2016. This wasn't the first time that Classes had been proposed as part of the official ECMAScript language by [TC39](https://github.com/tc39). In 2003, there was a similar proposal to include [Classes in ES4](https://www-archive.mozilla.org/js/language/old-es4/core/classes.html). ES4 never saw the light of day.

This actually highlights an intersting question. How did people write stateful components before ES6 classes? If React was released in 2013, and Classes weren't included until 2016 then that means thare was an entire generation of component definitions before Classes and Hooks.

Though it is no longer part of the official React package since version 15.5.0, there used to be a function called `createClass`. Without ES6, a component might look like this:

```javascript
var React = require("react");

var Counter = React.createClass({
  getInitialState: function () {
    return { count: this.props.initialCount };
  },
  handleClick: function () {
    this.setState({
      count: this.state.count + 1,
    });
  },
  render: function () {
    return (
      <div>
        {count}
        <button onClick={this.handleClick}>Increment</button>
      </div>
    );
  },
});
```

It isn't important to know the details of this, the only new concepts are `createClass` helper function and the `getInitialState` property. We don't use these anymore, and it will be rare to find `React.createClass` in the wild. If anyone wanted to use this syntax today they could follow the [instructions](https://reactjs.org/docs/react-without-es6.html) on the official documentation which include using a package called `create-react-class`.

## ES6 Class Review

Any new ECMAScript release takes a while to gain official support in browsers. This is why sites like [https://caniuse.com/](https://caniuse.com/) exist. In 2014 a tool called "6to5" was created by [Sebastian McKenzie](https://twitter.com/sebmck), which converts ES6 to ES5 for browser compatibility. With "6to5" evolving into the popular tool [Babel](https://babeljs.io/) it no longer matters if the browser officially supports the Class keyword, the developer can transpile to compatible code. The generated ES5 code, would be similar to the internal implementation of `React.createClass`.

Before ES6 we would create `Function` objects with methods attached. We won't go into detail, since we will be using the ES6 syntax going forward. It is good to see an example of a class being created using a function.

```javascript
function Point(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.getPosition = function getPosition() {
  return [this.x, this.y];
};

const cursor = new Point(0, 0);
console.log(cursor.getPosition()); // [0, 0]
```

If we were to create a similar object using the `class` keyword, we would have to also define the constructor. Notice in the previous example, this is the same as our `Point` function.

```javascript
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getPosition() {
    return [this.x, this.y];
  }
}

const cursor = new Point(0, 0);
console.log(cursor.getPosition()); // [0, 0]
```

A little nicer, and arguably more clean. This is a simple example, but the class syntax makes it a lot easier to `extend` other classes which allows for inheritence. When we ultimately make React components out of classes, we will `inherit` from the base Component class provided by React. This contains common functionality that all components share, similiar to the behaviour of `React.createClass`.

We will also want to become familiar with the difference between the class it self and an **instance** of the class. We create an _instance_ of the class with the `new` keyword. The `cursor` variable points to an _instance_ of the `Point` class. When we call `getPosition()` on the `cursor` _instance_ it is able to access the _instance_ variables `x` and `y`. We use the `this` keyword to access _instance_ variables from within the class.

MDN provides a good reference to the [Classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) API.

## React Components

When we want to apply this to React we do have to write a bit of code that is common to every class component. We make to either import the named `Component` class, or we can use `class Point extends React.Component` directly.

```javascript
import React, { Component } from "react";

class Point extends Component {
  render() {
    return (
      <div>
        {this.props.x}, {this.props.y}
      </div>
    );
  }
}
```

This is a very basic component that doesn't contain any state. It doesn't make sense to use a class here, since a function would do just fine instead.

```javascript
const Point = ({ x, y }) => (
  <div>
    {x}, {y}
  </div>
);
```

A class that has state can be created with a default `state` property.

```javascript
class Counter extends Component {
  state = {
    count: 0,
  };

  render() {
    return <div>{this.state.count}</div>;
  }
}
```

There will be code in the wild that uses a `constructor` to set the initial state. We are using a short cut with the `state` property. In order to use a `constructor`, we must also pass `props` to our base class using the built-in `super` method.

```javascript
class Counter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      count: 0,
    };
  }

  render() {
    return <div>{this.state.count}</div>;
  }
}
```

There isn't much reason to use a `constructor` anymore, it is considered legacy syntax.

### Setting State

This component doesn't do much after the first render, we need a way to change the state. Because we extend the `Component` base class, we can use the _inherited_ `setState` function. We access it using `this` context since it is not within the scope of `render` otherwise.

```javascript
class Counter extends Component {
  state = {
    count: 0,
  };

  render() {
    return (
      <div>
        {this.state.count}
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Increment
        </button>
      </div>
    );
  }
}
```

There is a very important distinction between this `setState` and a `setState` that we have been using with the `useState` Hook.

> With `this.setState` the object that is provided will be merged. If the current state is `{ a: 1, b: 2 }` and we call `this.setState({ a: 2 })`, we would expect to see the state change to `{ a: 2, b: 2}` on the following render. When we use `setState` with `useState` we have to manually merge our object with `setState({ ...state, a: 2})`. Keep this in mind when using class based components.

## Handling Events

The previous example has a familiar `onClick` event handler. We provide a new anonymous function that contains the instructions to `setState`. This is how the counter increases with each click.

We could change our code and move that logic into a function defined within the class. This makes it a bit easier to read.

```javascript
class Counter extends Component {
  state = {
    count: 0,
  };

  increment() {
    this.setState({ count: this.state.count + 1 });
  }

  render() {
    return (
      <div>
        {this.state.count}
        <button onClick={this.increment}>Increment</button>
      </div>
    );
  }
}
```

When we click on the button we will see the error `TypeError: Cannot read property 'count' of undefined`. This means that the value of `this.state` is undefined. We have run into an issue with our `this` binding being incorrect, we have lost access to our object instance because we passed this function into an event handler.

### Binding `this` Context

The article [React Binding Patterns: 5 Approaches for Handling `this`](https://www.freecodecamp.org/news/react-binding-patterns-5-approaches-for-handling-this-92c651b5af56/) provides a good overview of the different options available. This is one of the things that makes using `this` complex. We need to choose which approach we use to bind context.

At this point it makes the most sense to use arrow functions because they will use the `this` context of scope they are declared in. So it doesn't matter that the function is invoked by an event handler.

```javascript
class Counter extends Component {
  state = {
    count: 0,
  };

  increment = () => {
    this.setState({ count: this.state.count + 1 });
  };

  render() {
    return (
      <div>
        {this.state.count}
        <button onClick={this.increment}>Increment</button>
      </div>
    );
  }
}
```

> Note: This pattern requires the use of non-standard ECMAScript. There is currently a [proposal](https://github.com/tc39/proposal-class-fields) to make this official syntax. We currently rely on a babel transform that is included when we create our application using the `create-react-app` package.

## Lifecycle

Now that we know how to create components that contain state and can handle events, we need to also know how we can handle other types of side effects. Things like loading data or connecting to web socket servers. The [API](https://reactjs.org/docs/react-component.html) for the `React.Component` class contains numerous lifecycle methods.

### Mounting & Unmounting

When a component is added to the DOM, React performs a "Mounting" operation on the element. This means it will go through a series of steps to prepare the component for use.

First the constructor is called, if one isn't declared for the component that is absolutely fine. There is one in the `React.Component` base class. Then the component will `render` and after the `render` is complete, we will receive a call on a method named `componentDidMount`.

```javascript
class MountingExample extends Component {
  constructor(props) {
    super(props);
    console.log("First the constructor");
  }

  componentDidMount() {
    console.log("Third the componentDidMount");
  }

  render() {
    console.log("Second the render");
    return <div />;
  }
}
```

> There are actually a few other lifecycle methods in the documentation. Things like `static getDerivedStateFromProps` are skipped during this explanation to try and keep the basics easier. It is rare to use `getDerivedStateFromProps` so it is ok to skip it today.

There is a single method named `componentWillUnmount` that is called when a component is removed from the DOM.

```javascript
class UnmountingExample extends Component {
  componentWillUnmount() {
    console.log("Called when the component is removed from the dom");
  }

  render() {
    return <div />;
  }
}
```

### Updating Components

Although components are mounted and unmounted, most of their life is spent updating. There are lifecycle methods specifically associated with the act of updating. The one we will focus on today to start is named `componentDidUpdate` and React will pass both `prevProps` and `prevState` to it.

```javascript
class Counter extends Component {
  state = {
    count: 0,
  };

  componentDidUpdate(prevProps, prevState) {
    console.log("Either props or state has changed.");

    if (prevState.count !== this.state.count) {
      console.log("The count state has changed.");
    }
  }

  increment = () => {
    this.setState({ count: this.state.count + 1 });
  };

  render() {
    return (
      <div>
        {this.state.count}
        <button onClick={this.increment}>Increment</button>
      </div>
    );
  }
}
```

## Live Example

Today we build a WebSocket based, multi-room chat application. We will use ES6 classes to build components. We will introduce LifeCyle through the use of `componentDidMount`, `componentDidUpdate` and `componentWillUnmount`.

We already have a server that provides the real time update functionality. We now need to connect our React application to using the messaging API. We also have a small HTTP API available to retrieve larger chunks of data from the server when we load the application intially.

- When the `Application` component mounts we will connect to our `WebSocket` server. When it unmounts we will `close()` our connection.
- When the `RoomList` component mounts we will make a request using `axios` to the `/rooms` endpoint. We expect to receive a list of room names.
- When we mount the `Room` component we will make a request using `axios` to the `/messages?room=<room id>` endpoint, setup socket event handlers and join the room by sending a message to the socket server. When we unmount the `Room` we will send a message to the socket server to leave the room.
- When we change the `room` state in the `Application` component, our `Room` component will update when the new prop is passed down. If the room has changed, then the `Room` component will make a request using `axios` to the `/messages?room=<room id>` endpoint in the `componentDidUpdate` lifecycle method.

The `Room` component will unmount whenever we set the state of room to `""` inside of `Application` because we have a conditional render instruction in the render method.

## Bonus

The server is implemented in (mostly) TypeScript and uses the [deno](https://deno.land/) runtime. Deno is a project started a few years ago by [Ryan Dahl](https://github.com/ry) who happens to alow be the creator of [node](https://nodejs.org/en/).

> Both `node` and `deno` share the same four characters in the english alphabet.

Some people joke that the next runtime Ryan creates will be called _endo_ or _oden_. It can be useful to learn from these types of projects and their history. Ryan was kind enough to do a presentation called [10 Things I regret About Node.js](https://www.youtube.com/watch?v=M3BM9TB-8yA) where he explains his motivation for building another runtime environment.

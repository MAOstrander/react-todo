"use strict";

const React = require('react');
const ReactDOM = require('react-dom');


// var Hello = React.createClass({
//   displayName: 'Hello',
//   render: function() {
//     return React.createElement("div", null, "Hello ", this.props.name);
//   }
// });


// ReactDOM.render(
//   React.createElement(Hello, {name: "World"}),
//   document.getElementById('output')
// );

// var Hello = React.createClass({
//   render: function() {
//     return <div>Hello {this.props.name}</div>;
//   }
// });

// ReactDOM.render(
//   <Hello name="World" />,
//   document.getElementById('container')
// );

const TodoApp = (props) => {
  return (
    <div className="todo-app">
      Todo app.
    </div>
  )
};

ReactDOM.render(<TodoApp />, document.getElementById('output'));

console.log("Hello there");

const React = require('react');
const { render } = require('react-dom');

const TodoApp = (props) => {
  return (
    <div className="todo-app">
      Todo app.
    </div>
  )
};

render(<TodoApp />, document.getElementById('output'));

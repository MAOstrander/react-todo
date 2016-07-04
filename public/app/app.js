"use strict";

// const React = require('react');
// const blarg = require('react-dom');
import blargh from "react";
console.log(">", blargh);

class TodoItem extends React.Component {
  render () {
    let props = this.props;
    return (
      <div className="todo-item">
        <input type="checkbox" />
        <div className="label">{props.label}</div>
        <button className="delete-btn">&times;</button>
      </div>
    )
  }
}

const AddTodo = (props) => {
    return (
      <div className="add-todo">
        <input type="text" placeholder={props.placeholder} />
      </div>
    )
}

const TodoApp = (props) => {
  return (
    <div className="todo-app">
      <AddTodo placeholder="What to do?" />
      <TodoItem label="Work on codetest" />
      <TodoItem label="Grade quizzes" />
      <TodoItem label="Unpack from vacation" />
    </div>
  )
};


ReactDOM.render(<TodoApp />, document.getElementById('output'));


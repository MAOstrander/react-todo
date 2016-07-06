"use strict";
// const React = require('react');
// const ReactDOM = require('react-dom');

const TODOS = [
  {id: 0, label: 'Why not add a todo?', completed: false}
];

console.log("JQUERY?", $)

const AddTodo = (props) => {
    return (
      <div className="add-todo">
        <input type="text" placeholder={props.placeholder} onKeyPress={(e) => {
          if (e.charCode === 13) {
            props.onAdd({
              label: e.target.value,
              completed: false
            });

            e.target.value = '';
          }
        }}/>
      </div>
    )
}

class TodoItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: false
    };
  }
  render () {
    let props = this.props;

    let label = (
      <div className="label" onClick={() => {
          this.setState({editing: true});
        }}>{props.label}</div>
      );

    if (this.state.editing) {
        label = <input type="text" defaultValue={props.label} onBlur={(e) => {
          let text = e.target.value;
          if (!text) {
            e.target.value = props.label;
          }
          props.onItemEdit(props.id, text);
          this.setState({editing: false});
        }}
        onKeyPress={(e) => {
          if (e.charCode === 13) {
            props.onItemEdit(props.id, e.target.value);
            this.setState({editing: false});
          }
        }}/>
    }

    return (
      <div className="todo-item">
        <input type="checkbox" checked={props.completed} onChange={() => {
          props.onItemToggle(props.id);
        }}/>

        {label}

        <button className="delete-btn" onClick={(e) => {
          if (confirm(`Are you sure you want to delete ${props.label}?`)) {
            props.onItemDelete(props.id);
          }
          e.preventDefault();
        }}>&times;</button>
      </div>
    )
  }
}

const TodoList = (props) => {
  let todos = props.todos;

  return (
    <div className="todo-list">
      {
        todos.map((todo) => {
          return <TodoItem key={todo.id}
                           id={todo.id}
                           label={todo.label}
                           completed={todo.completed}
                           onItemToggle={props.onItemToggle}
                           onItemEdit={props.onItemEdit}
                           onItemDelete={props.onItemDelete} />
        })
      }
    </div>
  )
}

class TodoApp extends React.Component {
  componentDidMount() {
    fetch(`/api/comments`)
    .then((response) =>{
      return response.json();
    })
    .then((parsedTodo)=>{
      this.onUpdate(parsedTodo);
    })
  }

  constructor(props) {
    super(props);

    this.state = {
      todos: TODOS
    };

    this.onAdd = this.onAdd.bind(this);
    this.onItemEdit = this.onItemEdit.bind(this);
    this.onItemDelete = this.onItemDelete.bind(this);
    this.onItemToggle = this.onItemToggle.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.sendUpdate = this.sendUpdate.bind(this);
  }

  render () {
    let { todos } = this.state;

    return (
      <div className="todo-app">
        <AddTodo onAdd={this.onAdd} placeholder="Enter a to do item" />
        <TodoList todos={todos}
                  onItemToggle={this.onItemToggle}
                  onItemEdit={this.onItemEdit}
                  onItemDelete={this.onItemDelete} />
      </div>
    );
  }

  onUpdate(loadedTodos) {
    loadedTodos.forEach((task)=>{
        task.id = task._id;
      })
    this.setState({
      todos: loadedTodos
    })
  }

  sendUpdate(idToEdit, updateKey, updateValue) {
    $.ajax({
      url: `/api/edit`,
      type: 'POST',
      data: {idToEdit, updateKey, updateValue},
      success: function (data, status, xhr) {
        console.log("success", data);
      }.bind(this),
      error: function (xhr, status, error) {
        console.log("failure", error);
      }.bind(this)
    })
  }

  onAdd(todo) {
    $.ajax({
      url: `/api/add`,
      type: 'POST',
      data: todo,
      success: function (data, status, xhr) {
        console.log("success", data);
        this.onUpdate(data);
      }.bind(this),
      error: function (xhr, status, error) {
        console.log("failure", error);
      }.bind(this)
    })
  }

  onItemEdit(itemId, text) {
    let currentState = this;
    let todos = this.state.todos;
    todos = todos.map(function (todo) {
      if (todo.id !== itemId) {
        return todo;
      } else {
        currentState.sendUpdate(itemId, 'label', text);
        return Object.assign({}, todo, {label: text});
      }
    });

    this.setState({
      todos: todos
    });
  }

  onItemDelete(itemId) {
    $.ajax({
      url: `/api/delete`,
      type: 'DELETE',
      data: {"idToDelete": itemId},
      success: function (data, status, xhr) {
        console.log("success", data);
        // this.onUpdate(data);
      }.bind(this),
      error: function (xhr, status, error) {
        console.log("failure", error);
      }.bind(this)
    })
    let todos = this.state.todos.filter(function (todo) {
      return todo.id !== itemId;
    });

    this.setState({
      todos: todos
    });
  }

  onItemToggle(itemId) {
    let currentState = this;
    let todos = this.state.todos;
    todos = todos.map(function (todo) {
      if (todo.id !== itemId) {
        return todo;
      } else {
        currentState.sendUpdate(itemId, 'completed', !todo.completed);
        return Object.assign({}, todo, {completed: !todo.completed});
      }
    });
    console.log("todos", todos);

    this.setState({
      todos: todos
    });
  }
}

ReactDOM.render(<TodoApp />, document.getElementById('output'));

"use strict";
// const React = require('react');
// const ReactDOM = require('react-dom');

const TODOS = [
  {id: 1, label: 'Learn React', completed: false},
  {id: 2, label: 'Build a todo', completed: false},
  {id: 3, label: 'TESTING!', completed: false}
];

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

      parsedTodo.forEach((task)=>{
        task.id = task._id;
      })
      console.log("thing ???", parsedTodo);
      this.onUpdate(parsedTodo);
    })

    // let askTodo = new XMLHttpRequest();
    console.log("HELLO!!!!!!!");

    // askTodo.open("GET", `/api/comments`);
    // askTodo.send();
    // askTodo.addEventListener("load", this.runAfterRequestLoads);
    // askTodo.addEventListener("error", this.errorIfRequestFails);
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
    this.setState({
      todos: loadedTodos
    })
  }

  onAdd(todo) {
    let todos = this.state.todos;

    todo.id = todos.length + 1;
    this.setState({
      todos: [
        todo,
        ...todos
      ]
    });
  }

  onItemEdit(itemId, text) {
    let todos = this.state.todos.map(function (todo) {
      return todo.id !== itemId ? todo : Object.assign({}, todo, {label: text});
    });

    this.setState({
      todos: todos
    });
  }

  onItemDelete(itemId) {
    let todos = this.state.todos.filter(function (todo) {
      return todo.id !== itemId;
    });

    this.setState({
      todos: todos
    });
  }

  onItemToggle(itemId) {
    let todos = this.state.todos.map(function (todo) {
      return todo.id !== itemId ?
        todo : Object.assign({}, todo, {completed: !todo.completed});
    });

    this.setState({
      todos: todos
    });
  }

  runAfterRequestLoads(rawTodo) {
    if (rawTodo.target.status === 200) {
      var parsedTodo = JSON.parse(rawTodo.currentTarget.responseText)
      parsedTodo.forEach((task)=>{
        console.log("thing >>>", task);
        task.id = task._id;
      })
        console.log("thing >>>", parsedTodo);
        TodoApp.onUpdate(parsedTodo)
    } else {
      alert("We're sorry, something went wrong");
    }
  }

  errorIfRequestFails(errorData) {
    alert("Sorry, something went wrong with the request", errorData);
  }
}

ReactDOM.render(<TodoApp />, document.getElementById('output'));

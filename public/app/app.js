"use strict";
// Default task, is replaced by what's in the database
const TODOS = [
  {id: 0, label: 'Why not add a todo?', completed: false}
];

// Input Component at top of app. Enter new todos here!
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

// This is the class for each individual Todo Item
class TodoItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: false
    };
  }

  // This renders a different label depending on whether you clicked on the task to edit it or not, controlled by the 'editing' flag
  render() {
    let props = this.props;

    let label = (
      <div className="label" onClick={(e) => {
        this.setState({editing: true});
      }}>{props.label}</div>
    );

    // Changes are saved either onBlur or when the 'enter' key is pressed
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

    // This displays a checkbox, the label depending on the edit state, then the delete button
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

// This is the the list of todos, displaying a TodoItem for each todo
const TodoList = (props) => {
  let todos = props.todos;

  // Make sure the properties are passed on for each item
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

// These control the functionality for the app as a whole
class TodoApp extends React.Component {
  // Built in function that runs once the component renders
  componentDidMount() {
    fetch(`/api/init`)
    .then((response) =>{
      return response.json();
    })
    .then((parsedTodo)=>{
      this.onUpdate(parsedTodo);
    })
  }

  constructor(props) {
    super(props); // Pass properties up to the React.Component constructor

    // Initial state, will ge replaced once componentDidMount runs
    this.state = {
      todos: TODOS
    };

    // Bind 'this' for the functions
    this.onAdd = this.onAdd.bind(this);
    this.onItemEdit = this.onItemEdit.bind(this);
    this.onItemDelete = this.onItemDelete.bind(this);
    this.onItemToggle = this.onItemToggle.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.sendUpdate = this.sendUpdate.bind(this);
  }

  render() {
    let { todos } = this.state;

    // Settle on final structure of the app
    return (
      <div className="todo-app">
        <AddTodo onAdd={this.onAdd} placeholder="Enter a to-do item" />
        <TodoList todos={todos}
                  onItemToggle={this.onItemToggle}
                  onItemEdit={this.onItemEdit}
                  onItemDelete={this.onItemDelete} />
      </div>
    );
  }

  // Instead of creating new ids, I assigned the unique ids from the database once the list of todos are loaded
  onUpdate(loadedTodos) {
    loadedTodos.forEach((task)=>{
        task.id = task._id;
      })
    this.setState({
      todos: loadedTodos
    })
  }

  // This takes a todo by the id, as well as a key or value to update in the database.
  sendUpdate(idToEdit, updateKey, updateValue) {
    $.ajax({
      url: `/api/edit`,
      type: 'POST',
      data: {idToEdit, updateKey, updateValue},
      success: function (data, status, xhr) {
      }.bind(this),
      error: function (xhr, status, error) {
        console.log("failure", error);
      }.bind(this)
    })
  }

  // When you add a todo, it adds it sends it to the database and then will take the returned todos, reassign ids, then set the state
  onAdd(todo) {
    $.ajax({
      url: `/api/add`,
      type: 'POST',
      data: todo,
      success: function (data, status, xhr) {
        this.onUpdate(data);
      }.bind(this),
      error: function (xhr, status, error) {
        console.log("failure", error);
      }.bind(this)
    })
  }

  // This controls changing the text of a todo item, both locally and updating the item in the database
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

  // This deletes an individual todo item, both locally and sends a request to remove it from the database
  onItemDelete(itemId) {
    $.ajax({
      url: `/api/delete`,
      type: 'DELETE',
      data: {"idToDelete": itemId},
      success: function (data, status, xhr) {
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

  // This is marking a todo as completed, both locally and updating the item in the database
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

    this.setState({
      todos: todos
    });
  }
}

// Call the final render method to display everything
ReactDOM.render(<TodoApp />, document.getElementById('output'));

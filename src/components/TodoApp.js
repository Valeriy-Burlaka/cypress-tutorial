import React, {Component} from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import TodoForm from './TodoForm'
import TodoList from './TodoList'
import Footer from './Footer'
import {saveTodo, getTodo, deleteTodo, updateTodo} from '../lib/service'


export default class TodoApp extends Component {
  constructor(props) {
    super(props)

    this.state = {
      todos: [],
      currentTodo: ''
    }
    this.handleNewTodoChange = this.handleNewTodoChange.bind(this);
    this.handleTodoSubmit = this.handleTodoSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
  }

  componentDidMount () {
    getTodo()
      .then( ({data}) => this.setState({todos: data}))
      .catch(() => this.setState({error: true}));
  }

  handleNewTodoChange (e) {
    this.setState({currentTodo: e.target.value})
  }

  handleTodoSubmit (e) {
    e.preventDefault();
    const newTodo = {name: this.state.currentTodo, isComplete: false};
    saveTodo(newTodo)
      .then( ({data}) => {
        this.setState(
          {todos: this.state.todos.concat(data),
           currentTodo: ''}
        );
      })
      .catch(() => this.setState({error: true}));
  }

  handleDelete (id) {
    deleteTodo(id)
      .then(() => this.setState({
        todos: this.state.todos.filter(t => t.id !== id)
      }));
  }

  handleToggle (id) {
    const targetTodo = this.state.todos.find(t => t.id === id);
    const updated = Object.assign({}, targetTodo, {isComplete: !targetTodo.isComplete});
    updateTodo(updated)
      .then( ({data}) => {
        const todos = this.state.todos.map( t => {
          return t.id === data.id ? data : t;
        });
        this.setState({todos: todos});
      });
  }

  render () {
    const remainingTodos = this.state.todos.filter(t => !t.isComplete).length;
    return (
      <Router>
        <div>
          <header className="header">
            <h1>todos</h1>
            {this.state.error ? <span className="error">Oh No!</span> : null}
            <TodoForm 
              currentTodo={this.state.currentTodo}
              handleNewTodoChange={this.handleNewTodoChange}
              handleTodoSubmit={this.handleTodoSubmit}
            />
          </header>
          <section className="main">
            <TodoList todos={this.state.todos} 
              handleDelete={this.handleDelete}
              handleToggle={this.handleToggle}
            />
          </section>
          <Footer remainingTodos={remainingTodos} />
        </div>
      </Router>
    )
  }
}

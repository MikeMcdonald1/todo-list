import './App.css';
import TodoList from './TodoList';
import TodoForm from './TodoForm';
import { useState } from 'react';

function App() {
  const [todoList, setTodoList] = useState([]);
  function handleAddTodo(title) {
    const newTodo = { title: title, key: Date.now() };
    setTodoList([...todoList, newTodo]);
  }
  return (
    <div>
      <h1>To Do List</h1>
      <TodoForm onAddTodo={handleAddTodo} />
      <TodoList todoList={todoList} />
    </div>
  );
}

export default App;

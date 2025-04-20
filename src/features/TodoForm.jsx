import { useRef, useState } from 'react';
import TextInputWithLabel from '../shared/TextInputWithLabel';

function TodoForm({ onAddTodo }) {
  const todoTitleInput = useRef('');
  const [workingTodo, setWorkingToDo] = useState('');

  function handleAddTodo(event) {
    event.preventDefault();
    onAddTodo(workingTodo);
    setWorkingToDo('');
    todoTitleInput.current.focus();
  }

  return (
    <form onSubmit={handleAddTodo}>
      <TextInputWithLabel
        value={workingTodo}
        ref={todoTitleInput}
        onChange={(e) => setWorkingToDo(e.target.value)}
        elementId="todoTitle"
        labelText="Todo"
      />
      <button type="submit" disabled={workingTodo === ''}>
        Add Todo
      </button>
    </form>
  );
}

export default TodoForm;

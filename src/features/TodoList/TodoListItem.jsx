import { useState } from 'react';
import TextInputWithLabel from '../../shared/TextInputWithLabel';

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [workingTitle, setWorkingTitle] = useState(todo.title);
  // handleCancel event helper below
  function handleCancel() {
    setWorkingTitle(todo.title);
    setIsEditing(false);
  }

  // handleEdit helper below
  function handleEdit(event) {
    setWorkingTitle(event.target.value);
  }

  function handleUpdate(event) {
    if (!isEditing) {
      return;
    } else {
      event.preventDefault();
      onUpdateTodo({ ...todo, title: workingTitle });
      setIsEditing(false);
    }
  }

  return (
    <li>
      <form onSubmit={handleUpdate}>
        {isEditing ? (
          <TextInputWithLabel value={workingTitle} onChange={handleEdit} />
        ) : (
          <>
            <label>
              <input
                type="checkbox"
                id={`checkbox${todo.id}`}
                checked={todo.isCompleted}
                onChange={() => onCompleteTodo(todo.id)}
              />
            </label>
            <span onClick={() => setIsEditing(true)}>{todo.title}</span>
          </>
        )}
        <button type="button" onClick={handleCancel}>
          Cancel
        </button>
        <button type="button" onClick={handleUpdate}>
          Update
        </button>
      </form>
    </li>
  );
}

export default TodoListItem;

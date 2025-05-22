import { useState, useEffect } from 'react';
import TextInputWithLabel from '../../shared/TextInputWithLabel';
import styles from './TodoListItem.module.css';

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [workingTitle, setWorkingTitle] = useState(todo.title);

  useEffect(() => {
    setWorkingTitle(todo.title);
  }, [todo]);

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
    <li className={styles.listItem}>
      <form onSubmit={handleUpdate}>
        {isEditing ? (
          <div>
            <TextInputWithLabel value={workingTitle} onChange={handleEdit} />
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
            <button type="button" onClick={handleUpdate}>
              Update
            </button>
          </div>
        ) : (
          <div>
            <label>
              <input
                type="checkbox"
                id={`checkbox${todo.id}`}
                checked={todo.isCompleted}
                onChange={() => onCompleteTodo(todo.id)}
              />
            </label>
            <span onClick={() => setIsEditing(true)}>{todo.title}</span>
          </div>
        )}
      </form>
    </li>
  );
}

export default TodoListItem;

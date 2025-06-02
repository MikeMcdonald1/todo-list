import TodoListItem from './TodoListItem';
import App from '../../App';
import styles from './TodoList.module.css';

function TodoList({
  todoList,
  onCompleteTodo,
  onUpdateTodo,
  isLoading,
  currentPage,
  totalPages,
  setSearchParams,
  handlePreviousPage,
  handleNextPage,
}) {
  const filteredTodoList = todoList.filter(
    (todo) => todo.isCompleted === false
  );

  if (isLoading) {
    return <p>Todo list loading...</p>;
  }

  return filteredTodoList.length === 0 ? (
    <p>Add todo above to get started</p>
  ) : (
    <div>
      <ul className={styles.unorderedList}>
        {filteredTodoList.map((todo) => (
          <TodoListItem
            key={todo.id}
            todo={todo}
            onCompleteTodo={onCompleteTodo}
            onUpdateTodo={onUpdateTodo}
          />
        ))}
      </ul>

      <div className={styles.paginationControls}>
        <button onClick={handlePreviousPage}>Previous</button>
        <span className={styles.paginationPageNumber}>
          Page {currentPage} of {totalPages}{' '}
        </span>
        <button onClick={handleNextPage}>Next</button>
      </div>
    </div>
  );
}

export default TodoList;

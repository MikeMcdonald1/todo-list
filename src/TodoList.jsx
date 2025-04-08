import TodoListItem from './TodoListItem';

function TodoList({ todoList }) {
  return (
    <ul>
      {todoList.map((todo) => (
        <TodoListItem key={todo.key} todo={todo} />
      ))}
    </ul>
  );
}

export default TodoList;

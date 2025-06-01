import React from 'react';
import TodoForm from '../features/TodoForm';
import TodoList from '../features/TodoList/TodoList';
import TodosViewForm from '../features/TodosViewForm';

function TodosPage({
  todoState,
  handleAddTodo,
  completeTodo,
  updateTodo,
  sortDirection,
  setSortDirection,
  sortField,
  setSortField,
  queryString,
  setQueryString,
  clearError,
}) {
  const { todoList, isLoading, isSaving, errorMessage } = todoState;
  return (
    <div>
      <TodoForm onAddTodo={handleAddTodo} isSaving={isSaving} />

      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        isLoading={isLoading}
      />

      <TodosViewForm
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        sortField={sortField}
        setSortField={setSortField}
        queryString={queryString}
        setQueryString={setQueryString}
      />

      <hr />
      {todoState.errorMessage && (
        <div>
          <hr />
          <p className={styles.error}>{errorMessage}</p>
          {/* <button onClick={() => dispatch({ type: todoActions.clearError })}> */}
          <button onClick={clearError}>Dismiss</button>
        </div>
      )}
    </div>
  );
}

export default TodosPage;

import React from 'react';
import App from '../App';
import TodoForm from '../features/TodoForm';
import TodoList from '../features/TodoList/TodoList';
import TodosViewForm from '../features/TodosViewForm';
import { useSearchParams } from 'react-router';
import styles from '../pages/TodosPage';

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
  currentPage,
  totalPages,
  setSearchParams,
  handlePreviousPage,
  handleNextPage,
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
        currentPage={currentPage}
        totalPages={totalPages}
        setSearchParams={setSearchParams}
        handlePreviousPage={handlePreviousPage}
        handleNextPage={handleNextPage}
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

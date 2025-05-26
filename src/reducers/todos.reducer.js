import { useReducer } from 'react';

const actions = {
  //actions in useEffect that loads todos
  fetchTodos: 'fetchTodos',
  loadTodos: 'loadTodos',
  //found in useEffect and addTodo to handle failed requests
  setLoadError: 'setLoadError',
  //actions found in addTodo
  startRequest: 'startRequest',
  addTodo: 'addTodo',
  endRequest: 'endRequest',
  //found in helper functions
  updateTodo: 'updateTodo',
  completeTodo: 'completeTodo',
  //reverts todos when requests fail
  revertTodo: 'revertTodo',
  //action on Dismiss Error button
  clearError: 'clearError',
};

function reducer(state = initialState, action) {
  switch (action.type) {
    //useEffect (Pessimistic UI) section
    case actions.fetchTodos:
      return {
        ...state,
        isLoading: true,
      };

    case actions.loadTodos: {
      const todos = action.records.map((record) => {
        const todo = {
          id: record.id,
          title: record.fields.title,
          ...record.fields,
        };

        if (!todo.isCompleted) {
          todo.isCompleted = false;
        }
        return todo;
      });
      return {
        ...state,
        todoList: todos,
        isLoading: false,
      };
    }

    case actions.setLoadError:
      return {
        ...state,
        errorMessage: action.error.message,
        isLoading: false,
      };

    //addTodo (Pessimistic UI) section
    case actions.startRequest:
      return {
        ...state,
        isSaving: true,
      };

    case actions.addTodo: {
      const savedTodo = {
        id: action.records[0].id,
        ...action.records[0].fields,
      };

      if (!action.records[0].fields.isCompleted) {
        savedTodo.isCompleted = false;
      }

      return {
        ...state,
        todoList: [...state.todoList, savedTodo],
        isSaving: false,
      };
    }

    case actions.endRequest:
      return {
        ...state,
        isLoading: false,
        isSaving: false,
      };

    //updateTodo, completeTodo (Optimistic UI) section
    case actions.updateTodo: {
      const updatedTodo = {
        id: action.editedTodo.id,
        ...action.editedTodo,
      };

      if (updatedTodo.isCompleted === undefined) {
        updatedTodo.isCompleted = false;
      }

      const updatedTodos = state.todoList.map((todo) => {
        if (todo.id === updatedTodo.id) {
          return { ...updatedTodo };
        } else {
          return todo;
        }
      });
      return {
        ...state,
        todoList: updatedTodos,
      };
    }

    case actions.completeTodo: {
      const updatedTodos = state.todoList.map((todo) => {
        if (todo.id === action.id) {
          return { ...todo, isCompleted: true };
        }
        return todo;
      });

      return {
        ...state,
        todoList: updatedTodos,
      };
    }

    case actions.revertTodo: {
      const revertedTodos = state.todoList.map((todo) => {
        if (todo.id === action.id) {
          return { ...todo, isCompleted: false };
        } else {
          return todo;
        }
      });

      return {
        ...state,
        todoList: revertedTodos,
      };
    }

    case actions.clearError:
      return {
        ...state,
        errorMessage: '',
      };
    default:
      return state;
  }
}

const initialState = {
  todoList: [],
  isLoading: false,
  isSaving: false,
  errorMessage: '',
};

export { reducer, actions, initialState };

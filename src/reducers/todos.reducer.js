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
        id: records[0].id,
        ...records[0].fields,
      };

      if (!records[0].fields.isCompleted) {
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
        id: action.records[0].id, //changed from action.records[0]["id"]
        ...action.records[0].fields,
      };

      if (!action.records[0].fields.isCompleted) {
        //do we need action here?
        updatedTodo.isCompleted = false;
      }

      const updatedTodos = state.todoList.map((todo) => {
        //state.todoList.map????
        if (todo.id === updatedTodo.id) {
          return { ...updatedTodo };
        } else {
          return todo;
        }
      });
      return {
        ...state,
        todoList: updatedTodos, //do we need brackets and the spread here?? changed from [...updatedTodos]
      };
    }

    case actions.completeTodo: {
      const completedTodo = {
        //changed to completeTodo from updatedTodo which was already declared in actions.updateTodo
        id: action.records[0].id,
        ...action.records[0].fields,
      };

      if (!action.updatedTodo.isCompleted) {
        //do we need action here?
        completedTodo.isCompleted = false; //changed from updateTodo to completedTodo
      }

      const finalTodos = state.todoList.map((todo) => {
        //state.todoList.map????
        if (todo.id === completedTodo.id) {
          //changed from updatedTodo to completedTodo
          return { ...completedTodo }; //changed from updatedTodo to completedTodo
        } else {
          return todo;
        }
      });

      return {
        ...state,
        todoList: finalTodos, //do we need brackets or parentheses around `finalTodos`?
      };
    }

    case actions.revertTodo: {
      const revertedTodos = todoList.map((todo) => {
        //state.todoList.map??
        if (todo.id === id) {
          //action.id??
          return { ...todo, isCompleted: false };
        } else {
          return todo;
        }
      });

      return {
        ...state,
        todoList: revertedTodos, //do we need brackets or parentheses around `revertTodos`?
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

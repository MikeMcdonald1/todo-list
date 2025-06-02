import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';
import TodosViewForm from './features/TodosViewForm';
import TodosPage from './pages/TodosPage';
import Header from './shared/Header';
import { useState, useEffect, useCallback, useReducer } from 'react';
import styles from './App.module.css';
import {
  reducer as todosReducer,
  actions as todoActions,
  initialState as initialTodosState,
} from './reducers/todos.reducer';

const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
const token = `Bearer ${import.meta.env.VITE_PAT}`;

function App() {
  // const [todoList, setTodoList] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [errorMessage, setErrorMessage] = useState('');
  // const [isSaving, setIsSaving] = useState(false);
  const [sortField, setSortField] = useState('createdTime');
  const [sortDirection, setSortDirection] = useState('desc');
  const [queryString, setQueryString] = useState('');

  const encodeUrl = useCallback(() => {
    let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
    let searchQuery = '';
    if (queryString) {
      searchQuery = `&filterByFormula=SEARCH("${queryString}",+title)`;
    }
    return encodeURI(`${url}?${sortQuery}${searchQuery}`);
  }, [sortField, sortDirection, queryString]);

  const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);

  // 1. addTodo FUNCTION
  const addTodo = async (newTodo) => {
    const payload = {
      records: [
        {
          fields: {
            title: newTodo.title,
            isCompleted: newTodo.isCompleted,
          },
        },
      ],
    };

    const options = {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    try {
      dispatch({ type: todoActions.startRequest });
      const resp = await fetch(encodeUrl(), options);

      if (!resp.ok) {
        throw new Error('Failed to add todo');
      }
      const { records } = await resp.json();
      dispatch({ type: todoActions.addTodo, records });
    } catch (error) {
      dispatch({ type: todoActions.setLoadError, error });
    } finally {
      dispatch({ type: todoActions.endRequest });
    }
  };

  // 2. fetchTodos FUNCTION (Fetching from Airtable)
  useEffect(() => {
    const fetchTodos = async () => {
      dispatch({ type: todoActions.fetchTodos });

      const options = {
        method: 'GET',
        headers: {
          Authorization: token,
        },
      };

      try {
        const resp = await fetch(encodeUrl(), options);

        if (!resp.ok) {
          throw new Error(resp.message);
        }

        const response = await resp.json();
        dispatch({ type: todoActions.loadTodos, records: response.records });
      } catch (error) {
        dispatch({ type: todoActions.setLoadError, error });
      }
    };

    fetchTodos();
  }, [sortField, sortDirection, queryString]);

  // 3. handleAddTodo FUNCTION

  function handleAddTodo(title) {
    const newTodo = { title: title, isCompleted: false };
    addTodo(newTodo);
  }

  // 4. completeTodo FUNCTION
  async function completeTodo(id) {
    dispatch({ type: todoActions.completeTodo, id });
    const options = {
      method: 'PATCH',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        records: [
          {
            id: id,
            fields: {
              isCompleted: true,
            },
          },
        ],
      }),
    };

    try {
      const resp = await fetch(encodeUrl(), options);

      if (!resp.ok) {
        throw new Error('Failed to complete todo');
      }

      const { records } = await resp.json();
    } catch (error) {
      dispatch({ type: todoActions.revertTodo, id });
    }
  }

  // 5. updateTodo FUNCTION

  async function updateTodo(editedTodo) {
    const originalTodo = todoState.todoList.find(
      (todo) => todo.id === editedTodo.id
    );

    const payload = {
      records: [
        {
          id: editedTodo.id,
          fields: {
            title: editedTodo.title,
            isCompleted: editedTodo.isCompleted,
          },
        },
      ],
    };

    const options = {
      method: 'PATCH',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    try {
      dispatch({ type: todoActions.updateTodo, editedTodo });
      const resp = await fetch(encodeUrl(), options);

      if (!resp.ok) {
        throw new Error('Failed to update todo');
      }

      const { records } = await resp.json();
    } catch (error) {
      dispatch({ type: todoActions.revertTodo, originalTodo });
    } finally {
      dispatch({ type: todoActions.endRequest });
    }
  }

  // return statement for our main App.jsx component
  return (
    <div>
      <Header title="To Do List" />
      <div className={styles.container}>
        {/* <h1 className={styles.header}>To Do List</h1> */}
        <TodosPage
          todoState={todoState}
          handleAddTodo={handleAddTodo}
          completeTodo={completeTodo}
          updateTodo={updateTodo}
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
          sortField={sortField}
          setSortField={setSortField}
          queryString={queryString}
          setQueryString={setQueryString}
          todoList={todoState.todoList}
          isLoading={todoState.isLoading}
          isSaving={todoState.isSaving}
          errorMessage={todoState.errorMessage}
          clearError={() => dispatch({ type: todoActions.clearError })}
        />
      </div>
    </div>
  );
}

export default App;

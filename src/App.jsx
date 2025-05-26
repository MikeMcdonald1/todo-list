import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';
import TodosViewForm from './features/TodosViewForm';
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
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
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
      //code removed here for actions.addTodo

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
        //code removed here for actions.loadTodos
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
    const updatedTodos = todoList.map((todo) => {
      if (todo.id === id) {
        return { ...todo, isCompleted: true };
      } else {
        return todo;
      }
    });
    setTodoList(updatedTodos);
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
      // CODE CUT/PASTED FOR actions.updatedTodo
      // const updatedTodo = {
      //   id: records[0].id,
      //   ...records[0].fields,
      // };

      // if (!updatedTodo.isCompleted) {
      //   updatedTodo.isCompleted = false;
      // }

      // const finalTodos = todoList.map((todo) => {
      //   if (todo.id === updatedTodo.id) {
      //     return { ...updatedTodo };
      //   } else {
      //     return todo;
      //   }
      // });

      // setTodoList(finalTodos);
    } catch (error) {
      console.log(error);
      setErrorMessage(error.message);
      //CODE CUT/PASTED FOR actions.revertTodo
      // const revertedTodos = todoList.map((todo) => {
      //   if (todo.id === id) {
      //     return { ...todo, isCompleted: false };
      //   } else {
      //     return todo;
      //   }
      // });
      // setTodoList(revertedTodos);
    }
  }

  // 5. updateTodo FUNCTION

  async function updateTodo(editedTodo) {
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);

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
      const resp = await fetch(encodeUrl(), options);

      if (!resp.ok) {
        throw new Error('Failed to update todo');
      }

      const { records } = await resp.json();
      // code cut/paste here for actions.updateTodo
      // const updatedTodo = {
      //   id: records[0]['id'],
      //   ...records[0].fields,
      // };

      // if (!records[0].fields.isCompleted) {
      //   updatedTodo.isCompleted = false;
      // }

      // const updatedTodos = todoList.map((todo) => {
      //   if (todo.id === updatedTodo.id) {
      //     return { ...updatedTodo };
      //   } else {
      //     return todo;
      //   }
      // });

      // setTodoList([...updatedTodos]);
    } catch (error) {
      console.log(error);
      setErrorMessage(`${error.message}. Reverting todo...`);
      // const revertedTodos = todoList.map((todo) =>
      //   todo.id === originalTodo.id ? { ...originalTodo } : todo
      // );
      setTodoList([...revertedTodos]);
    } finally {
      setIsSaving(false);
    }
  }

  // return statement for our main App.jsx component
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>To Do List</h1>
      <TodoForm onAddTodo={handleAddTodo} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        isLoading={isLoading}
      />
      <hr />
      <TodosViewForm
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        sortField={sortField}
        setSortField={setSortField}
        queryString={queryString}
        setQueryString={setQueryString}
      />
      {errorMessage && (
        <div>
          <hr />
          <p className={styles.error}>{errorMessage}</p>
          <button onClick={() => setErrorMessage('')}>Dismiss</button>
        </div>
      )}
    </div>
  );
}

export default App;

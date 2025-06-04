import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';
import TodosViewForm from './features/TodosViewForm';
import Header from './shared/Header';
import TodosPage from './pages/TodosPage';
import About from './pages/About';
import NotFound from './pages/NotFound';
import { useState, useEffect, useCallback, useReducer } from 'react';
import styles from './App.module.css';
import {
  reducer as todosReducer,
  actions as todoActions,
  initialState as initialTodosState,
} from './reducers/todos.reducer';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';

const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
const token = `Bearer ${import.meta.env.VITE_PAT}`;

function App() {
  const [sortField, setSortField] = useState('createdTime');
  const [sortDirection, setSortDirection] = useState('desc');
  const [queryString, setQueryString] = useState('');
  const [title, setTitle] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const itemsPerPage = 15;
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const indexOfFirstTodo = (currentPage - 1) * itemsPerPage;
  const navigate = useNavigate();

  const encodeUrl = useCallback(() => {
    let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
    let searchQuery = '';
    if (queryString) {
      searchQuery = `&filterByFormula=SEARCH("${queryString}",+title)`;
    }
    return encodeURI(`${url}?${sortQuery}${searchQuery}`);
  }, [sortField, sortDirection, queryString]);

  const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);
  const filteredTodoList = todoState.todoList.filter(
    (todo) =>
      todo.title.toLowerCase().includes(queryString.toLowerCase()) &&
      !todo.isCompleted
  );

  console.log('filteredTodoList:', filteredTodoList);

  const paginatedTodoList = filteredTodoList.slice(
    indexOfFirstTodo,
    indexOfFirstTodo + itemsPerPage
  );
  const totalPages = Math.ceil(filteredTodoList.length / itemsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setSearchParams({ page: currentPage - 1 });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setSearchParams({ page: currentPage + 1 });
    }
  };

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

  useEffect(() => {
    if (location.pathname === '/') {
      setTitle('To Do List');
    } else if (location.pathname === '/about') {
      setTitle('About');
    } else {
      setTitle('Not Found');
    }
  }, [location]);

  useEffect(() => {
    if (totalPages > 0) {
      if (isNaN(currentPage) || currentPage < 1 || currentPage > totalPages) {
        navigate('/');
      }
    }
  }, [currentPage, totalPages, navigate]);

  // return statement for our main App.jsx component
  return (
    <div>
      <Header title={title} />
      <div className={styles.container}>
        <Routes>
          <Route
            path="/"
            element={
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
                // todoList={todoState.todoList}
                isLoading={todoState.isLoading}
                isSaving={todoState.isSaving}
                errorMessage={todoState.errorMessage}
                clearError={() => dispatch({ type: todoActions.clearError })}
                currentPage={currentPage}
                totalPages={totalPages}
                setSearchParams={setSearchParams}
                handlePreviousPage={handlePreviousPage}
                handleNextPage={handleNextPage}
                paginatedTodoList={paginatedTodoList}
              />
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

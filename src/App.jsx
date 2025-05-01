import './App.css';
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';
import { useState, useEffect } from 'react';

function App() {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

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
      setIsSaving(true);
      const resp = await fetch(url, options);

      if (!resp.ok) {
        throw new Error('Failed to add todo');
      }

      const { records } = await resp.json();
      const savedTodo = {
        id: records[0].id,
        ...records[0].fields,
      };

      if (!records[0].fields.isCompleted) {
        savedTodo.isCompleted = false;
      }

      setTodoList([...todoList, savedTodo]);
    } catch (error) {
      console.log(error);
      setErrorMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // 2. fetchTodos FUNCTION (Fetching from Airtable)
  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);

      const options = {
        method: 'GET',
        headers: {
          Authorization: token,
        },
      };

      try {
        const resp = await fetch(url, options);

        if (!resp.ok) {
          throw new Error(resp.message);
        }

        const response = await resp.json();
        const todos = response.records.map((record) => {
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
        console.log(todos);
        setTodoList([...todos]);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []);

  // Removed original handleAddTodo function
  // 3. handleAddTodo FUNCTION
  //
  // function handleAddTodo(title) {
  //   const newTodo = { title: title, id: Date.now(), isCompleted: false };
  //   setTodoList([...todoList, newTodo]);
  // }

  function handleAddTodo(title) {
    const newTodo = { title: title, isCompleted: false };
    addTodo(newTodo);
  }

  // const completeTodo = async (id) => {
  //   const updatedTodos = todoList.map((todo) => {
  //     if (todo.id === id) {
  //       return { ...todo, isCompleted: true };
  //     } else {
  //       return todo;
  //     }
  //   });

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
      const resp = await fetch(url, options);

      if (!resp.ok) {
        throw new Error('Failed to complete todo');
      }

      const { records } = await resp.json();
      const updatedTodo = {
        id: records[0].id,
        ...records[0].fields,
      };

      if (!updatedTodo.isCompleted) {
        updatedTodo.isCompleted = false;
      }

      const finalTodos = todoList.map((todo) => {
        if (todo.id === updatedTodo.id) {
          return { ...updatedTodo };
        } else {
          return todo;
        }
      });

      setTodoList(finalTodos);
    } catch (error) {
      console.log(error);
      setErrorMessage(error.message);

      const revertedTodos = todoList.map((todo) => {
        if (todo.id === id) {
          return { ...todo, isCompleted: false };
        } else {
          return todo;
        }
      });
      setTodoList(revertedTodos);
    }
  }

  // 5. updateTodo FUNCTION

  async function updateTodo(editedTodo) {
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);

    // const updateTodo = async (editedTodo) => {
    //   const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);
    // };

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

    console.log(JSON.stringify(payload));
    console.log(originalTodo);
    console.log(editedTodo);

    try {
      const resp = await fetch(url, options);

      if (!resp.ok) {
        throw new Error('Failed to update todo');
      }

      const { records } = await resp.json();

      const updatedTodo = {
        id: records[0]['id'],
        ...records[0].fields,
      };

      if (!records[0].fields.isCompleted) {
        //updated from (!updatedTodo.isCompleted)
        updatedTodo.isCompleted = false;
      }

      //Changed from 'updateTodo.id' to 'updatedTodos' per assignment. why?? Changed from one function to another function, but why not use object?
      //final change: 'updatedTodos' to 'updatedTodo'.
      //
      //updateTodo function
      //updatedTodo object
      //updatedTodos function

      const updatedTodos = todoList.map((todo) => {
        if (todo.id === updatedTodo.id) {
          return { ...updatedTodo };
        } else {
          return todo;
        }
      });
      console.log(updatedTodos);
      setTodoList([...updatedTodos]);
    } catch (error) {
      console.log(error);
      setErrorMessage(`${error.message}. Reverting todo...`); //changed ${errorMessage} to ${error.message} per assignment.
      const revertedTodos = todoList.map((todo) =>
        todo.id === originalTodo.id ? { ...originalTodo } : todo
      );
      setTodoList([...revertedTodos]);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div>
      <h1>To Do List</h1>
      <TodoForm onAddTodo={handleAddTodo} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        isLoading={isLoading}
      />
      {errorMessage && (
        <div>
          <hr />
          <p>{errorMessage}</p>
          <button onClick={() => setErrorMessage('')}>Dismiss</button>
        </div>
      )}
    </div>
  );
}

export default App;

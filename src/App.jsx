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

  // 1. ADDTODO FUNCTION
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

  // 2. FETCHING TODOS FUNCTION (FETCHING FROM AIRTABLE)
  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true); //Use setIsLoading to update isLoading to true
      const options = {
        //Create an options object for the fetch request. Include:
        method: 'GET', //A method property set to "GET",
        headers: {
          //And a headers property set to an object containing
          Authorization: token, //the following key/value pair: "Authorization": token.
        },
      };

      //Set up try/catch/finally blocks to handle the fetch:
      try {
        const resp = await fetch(url, options); //Save an awaited fetch to the const resp and pass in the url and options : const resp = await fetch(url, options);

        if (!resp.ok) {
          //If resp.ok evaluates to false in an if statement, throw a new Error that takes in resp.message.
          throw new Error(resp.message);
        }

        const response = await resp.json(); //Await the value that response.json() returns.

        const todos = response.records.map((record) => {
          //in a map method called on records, define an anonymous function: It takes a record param.
          const todo = {
            //It contains a const todo = {}
            id: record.id, //inside the object, assign the record properties to the appropriate todo properties
            title: record.fields.Title, //MISSING PART FROM ASSIGNMENT to display Title(case sensitive) on todo list app
            ...record.fields,
          };

          if (!todo.isCompleted) {
            //if isCompleted is not truthy, you will want to explicitly set the property equal to false
            todo.isCompleted = false;
          }
          return todo;
        });
        console.log(todos);
        setTodoList([...todos]);
      } catch (error) {
        //the catch block takes in an error parameter
        setErrorMessage(error.message); //use setErrorMessage with error.message to set an error message that will display to the user shortly
      } finally {
        setIsLoading(false); //setIsLoading value back to false
      }
    };

    fetchTodos();
  }, []); //empty dependency array

  // 3. HANDLEADDTODO FUNCTION
  function handleAddTodo(title) {
    const newTodo = { title: title, id: Date.now(), isCompleted: false };
    setTodoList([...todoList, newTodo]);
  }

  // 4. COMPLETETODO FUNCTION
  async function completeTodo(id) {
    //1. optimistically update the UI: marks the todo as completed immediately
    const updatedTodos = todoList.map((todo) => {
      if (todo.id === id) {
        //If this is the todo being completed, mark it as complete
        return { ...todo, isCompleted: true }; //mark as complete
      } else {
        //otherwise......
        return todo; //leave todo unchanged
      }
    });
    setTodoList(updatedTodos); //update the UI with the new todo list

    const options = {
      method: 'PATCH', //used bc we are updating something
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        //Turn data into JSON format
        records: [
          {
            id: id, //Tell airtable which todo to update
            fields: {
              isCompleted: true,
            },
          },
        ],
      }),
    };

    try {
      //Try to send the update to Airtable
      const resp = await fetch(url, options);

      if (!resp.ok) {
        //If the server says something went wrong, throw error
        throw new Error('Failed to complete todo');
      }

      //if everything goes fine, get the updataed data from the server
      const { records } = await resp.json();
      const updatedTodo = {
        id: records[0].id, //Get the id back from Airtable
        ...records[0].fields, //Get all the fields like title and isCompleted
      };

      //if isCompleted is somehow not true, fix it to be false
      if (!updatedTodo.isCompleted) {
        updatedTodo.isCompleted = false;
      }

      //update screen with data received back from Airtable
      const finalTodos = todoList.map((todo) => {
        if (todo.id === updatedTodo.id) {
          return { ...updatedTodo }; //replace the old todo with the updated one
        } else {
          return todo; //keep the other todos the same
        }
      });

      setTodoList(finalTodos); //save the new list
    } catch (error) {
      console.log(error); //if there was a problem, catch it here
      setErrorMessage(error.message); //show the error message to the user

      //undo the change on the screen (put the todo back how it was)
      const revertedTodos = todoList.map((todo) => {
        if (todo.id === id) {
          return { ...todo, isCompleted: false }; //set isCompleted back to false from true
        } else {
          return todo; //leave the other todos the same
        }
      });
      setTodoList(revertedTodos); //save the reverted list
    }
  }

  // 5. UPDATETODO FUNCTION

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
      const resp = await fetch(url, options);

      if (!resp.ok) {
        throw new Error('Failed to update todo');
      }

      const { records } = await resp.json();
      const updatedTodo = {
        id: records[0].id,
        ...records[0].fields,
      };

      if (!updatedTodo.isCompleted) {
        updatedTodo.isCompleted = false;
      }

      const updatedTodos = todoList.map((todo) => {
        if (todo.id === updateTodo.id) {
          return { ...updatedTodo };
        } else {
          return todo;
        }
      });

      setTodoList([...updatedTodos]);
    } catch (error) {
      console.log(error);
      setErrorMessage(`${errorMessage}. Reverting todo...`);
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

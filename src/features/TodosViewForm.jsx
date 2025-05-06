import React, { useState, useEffect } from 'react';
import App from '../App';

function TodosViewForm({
  sortDirection,
  setSortDirection,
  sortField,
  setSortField,
  queryString,
  setQueryString,
}) {
  // added local state for serach input (localQueryString) to manage typing delay
  // refactored search input and clear button to use localQueryString
  // used setTimeout inside useEffect to delay the update of queryString by 500ms
  // cleaned up previous timeouts on each re-render using a clean up function, clearTimeout(debounce)

  //define local state for the search input and set its defaultValue to queryString
  const [localQueryString, setLocalQueryString] = useState(queryString);

  //create useEffect()
  useEffect(() => {
    // call setTimeout and assign it a constant, debounce
    const debounce = setTimeout(() => {
      setQueryString(localQueryString); // call setQueryString(localQueryString)
    }, 500); // give it a delay of 500ms

    return; //add anonymous function that calls clearTimeout that takes in debounce
    () => {
      clearTimeout(debounce);
    };
  }, [localQueryString, setQueryString]); //added these to dependency array

  function preventRefresh(event) {
    event.preventDefault();
  }
  return (
    <form onSubmit={preventRefresh}>
      <div>
        <label>Search Todos:</label>
        <input
          type="text"
          value={localQueryString} //refactored from 'queryString'
          onChange={(e) => {
            setLocalQueryString(e.target.value); //refactored from 'setQueryString
          }}
        ></input>
        <button
          type="button"
          onClick={(e) => {
            setLocalQueryString(''); //refactored from 'setQueryString'
          }}
        >
          Clear
        </button>
      </div>

      <div>
        <label>Sort by</label>
        <select
          value={sortField}
          onChange={(event) => {
            setSortField(event.target.value);
          }}
        >
          <option value="title">Title</option>
          <option value="createdTime">Time added</option>
        </select>

        <label>Direction</label>
        <select
          value={sortDirection}
          onChange={(event) => {
            setSortDirection(event.target.value);
          }}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </form>
  );
}

export default TodosViewForm;

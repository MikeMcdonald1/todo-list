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
  const [localQueryString, setLocalQueryString] = useState(queryString);

  useEffect(() => {
    const debounce = setTimeout(() => {
      setQueryString(localQueryString);
    }, 500);

    return () => {
      clearTimeout(debounce);
    };
  }, [localQueryString, setQueryString]);

  function preventRefresh(event) {
    event.preventDefault();
  }
  return (
    <form onSubmit={preventRefresh}>
      <div>
        <label>Search Todos:</label>
        <input
          type="text"
          value={localQueryString}
          onChange={(e) => {
            setLocalQueryString(e.target.value);
          }}
        ></input>
        <button
          type="button"
          onClick={(e) => {
            setLocalQueryString('');
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

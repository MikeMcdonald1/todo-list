import React, { useState, useEffect } from 'react';
import App from '../App';
import styled from 'styled-components';

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
`;

const FiltersWrapper = styled.div`
  display: flex;
  gap: 0.15rem;
  flex-wrap: wrap;
`;

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
    <StyledForm onSubmit={preventRefresh}>
      <FiltersWrapper>
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
      </FiltersWrapper>

      <FiltersWrapper>
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
      </FiltersWrapper>
    </StyledForm>
  );
}

export default TodosViewForm;

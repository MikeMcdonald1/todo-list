import { useRef, useState } from 'react';
import TextInputWithLabel from '../shared/TextInputWithLabel';
import styled from 'styled-components';

const StyledForm = styled.form`
  display: flex;
  gap: 0.15rem;
`;

const StyledButton = styled.button`
  padding: 0.25rem;
  &:disabled {
    font-style: italic;
  }
`;

function TodoForm({ onAddTodo }) {
  const todoTitleInput = useRef('');
  const [workingTodo, setWorkingToDo] = useState('');

  function handleAddTodo(event) {
    event.preventDefault();
    onAddTodo(workingTodo);
    setWorkingToDo('');
    todoTitleInput.current.focus();
  }

  return (
    <StyledForm onSubmit={handleAddTodo}>
      <TextInputWithLabel
        value={workingTodo}
        ref={todoTitleInput}
        onChange={(e) => setWorkingToDo(e.target.value)}
        elementId="todoTitle"
        labelText="Todo"
      />
      <StyledButton type="submit" disabled={workingTodo === ''}>
        Add Todo
      </StyledButton>
    </StyledForm>
  );
}

export default TodoForm;

import React, { use } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { removeTodo } from '../utils/todoSlice';

const Todos = () => {
    const todos = useSelector(state => state.todo.todos);
    const dispatch = useDispatch();
  return (
        <>
        <div>Todos</div>
    
    </>

  )
}

export default Todos

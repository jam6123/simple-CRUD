import { useEffect } from "react"
import { useState } from "react"
import Message from "./component/Message"

const existingTodos = JSON.parse(localStorage.getItem('todos'))

function App() {
  const [todos, setTodos] = useState(existingTodos || [])
  const [text, setText] = useState('')
  const [todoToEdit, setTodoToEdit] = useState(null)
  const [message, setMessage] = useState({
    value: '',
    show: false
  })

  const isValueChanged = todoToEdit?.title !== todos.find(todo => todo.id === todoToEdit?.id)?.title

  function handleChange(e) {
    setText(e.target.value)
  }
  
  function handleSubmit(e) {
    e.preventDefault()
    setTodoToEdit(null)
    if(text.trim() === '' || text.length < 5) {
      setMessage({
        value: 'Input cannot be empty or less than 5 characters!',
        show: true
      })
      return
    } 
    setTodos([
      ...todos,
      {
        id: Date.now(),
        title: text,
      }
    ])
    setText('')
  }

  function handleDelete(id) {
    const filtered = todos.filter(todo => todo.id !== id)
    setTodos(filtered)
  }

  function handleEdit(e) {
    setTodoToEdit({
      ...todoToEdit,
      title: e.target.value
    })
  }

  function handleCancle() {
    setTodoToEdit(null)
  }

  function handleUpdate(e) {
    if(todoToEdit.title === '') {
      setMessage({
        value: 'Put atleast any character to update!',
        show: true
      })
      return
    }

    const updated = todos.map(todo => {
      if(todo.id === todoToEdit.id) {
        return {...todoToEdit}
      }
      return todo
    })

    setTodos(updated)
    setTodoToEdit(null)
  }

  useEffect(() => {
    function saveToLocalStorage() {
      localStorage.setItem('todos', JSON.stringify(todos))
    }
    saveToLocalStorage()
  }, [todos])
  
  // hide Message component
  useEffect(() => {
    let timeId = null
    if(message.show === false) return
    function hideMessage() {
      timeId = setTimeout(() => {
        setMessage({ ...message, show: false })
        console.log('timeout')
      }, 4000)
    }
    hideMessage()
    
    return () => {
      clearTimeout(timeId)
    }
  }, [message.show])

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="new todo"
          value={text}
          onChange={handleChange}
        />
        <button>Add</button>
      </form>
      <ul>
        {(todos.length === 0) && (<p style={{ color: '#ababab', padding: '0 40px' }}>Empty</p>)}
        {todos.map(todo => (
          <li key={todo.id}>
            <div className="li-content">
              {todoToEdit?.id === todo.id ? (
                <>
                  <input type="text" value={todoToEdit.title} onChange={handleEdit} />
                  <div className="btn-container">
                    <button 
                      className={isValueChanged ? 'update-btn' : ''} 
                      onClick={handleUpdate} 
                      disabled={!isValueChanged}
                      >
                      Update
                    </button>
                    <button className="cancel-btn" onClick={handleCancle}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <p>{todo.title}</p>
                  <div className="btn-container">
                    <button className="edit-btn" onClick={() => setTodoToEdit(todo)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(todo.id)}>Delete</button>
                  </div>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
      <Message message={message} />
    </>
  )
}

export default App

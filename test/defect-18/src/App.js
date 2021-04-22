import React from 'react'
import './App.css'

function Todo({ todo, index, completeTodo, unCompleteTodo, removeTodo, editTodo, setTodo, editing }) {
  if (!editing)
    return (
      <div id="todo" className="todo block text--700 text-center bg-gray-200 hover:bg-gray-400 px-4 py-2 mt-2" style={{ backgroundColor: todo.completed ? "#bdffcf" : "" }}>
        {todo.text}
        <div id="NotTodo">
          {todo.completed ? <button onClick={() => unCompleteTodo(index)} className="bg-gray-300 hover:bg-yellow-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center transition duration-500 ease-in-out transform hover:-translate-y-1"> Pending </button>
            : <button onClick={() => completeTodo(index)} className="bg-gray-300 hover:bg-green-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center transition duration-500 ease-in-out transform hover:-translate-y-1"> Complete </button>}
          <button onClick={() => removeTodo(index)} className="bg-gray-300 hover:bg-red-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center transition duration-500 ease-in-out transform hover:-translate-y-1"> Delete </button>
          <button onClick={() => editTodo(index)} className="bg-gray-300 hover:bg-blue-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center transition duration-500 ease-in-out transform hover:-translate-y-1"> Edit </button>
        </div>
      </div>
    )
  else return (
    <EditTodo index={index} oldTodo={todo} setTodo={setTodo} />
  )
}

function EditTodo({ index, oldTodo, setTodo }) {
  const [inputVal, setInputValue] = React.useState(oldTodo.text)
  const handleSubmit = event => {
    event.preventDefault()
    // if (!value) { alert('The todo must have a description.') return}
    if (inputVal.length === 0)
      return
    setTodo(index, inputVal)
  }
  return (
    <div className="w-full center" id="addTodo">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-4 pb-8 mb-4">
        <div className="form-group">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="To-do:">
              Editing to-do {oldTodo.value}
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="To-do"
              type="text"
              value={inputVal}
              // BUG IS HERE, same case for the input for Add to do
              onChange={setInputValue({inputVal})}
            />
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <button type="submit" className="bg-blue-500 text-white font-bold py-2 px-4 rounded transition duration-500 ease-in-out bg-blue-500 hover:bg-purple-500 transform hover:-translate-y-1 hover:scale-110 ...">Save</button>
        </div>
      </form>
    </div>
  )
}

function AddTodo({ addTodo }) {
  const [inputVal, setInputValue] = React.useState("")

  const handleSubmit = event => {
    event.preventDefault()
    // if (!value) { alert('The todo must have a description.') return}
    if (inputVal.length === 0)
      return
    addTodo(inputVal)
    setInputValue("")
  }

  return (
    <div className="w-full center" id="addTodo">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-4 pb-8 mb-4">
        <h1 style={{ textAlign: 'center' }}><strong>Add Todos</strong></h1>
        <div className="form-group">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="To-do:">
              To-do:
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="To-do"
              type="text"
              value={inputVal}
              onChange={e => setInputValue(e.target.value)}
            />
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <button type="submit" className="bg-blue-500 text-white font-bold py-2 px-4 rounded transition duration-500 ease-in-out bg-blue-500 hover:bg-green-500 transform hover:-translate-y-1 hover:scale-110 ...">Add</button>
        </div>
      </form>
    </div>
  )
}

function App() {
  var initialTodoList = []

  try {
    initialTodoList = JSON.parse(window.localStorage.getItem('todoList')) || []
  }
  catch (err) {
    initialTodoList = []
  }

  const [todoList, setTodoList] = React.useState(initialTodoList)

  React.useEffect(() => {
    window.localStorage.setItem('todoList', JSON.stringify(todoList))
  })

  // BUG IS HERE
  const addTodo = text => {
    const newTodoList = [todoList, { text }]
    setTodoList(newTodoList)
  }

  const completeTodo = index => {
    const newTodoList = [...todoList]
    newTodoList[index].completed = true
    setTodoList(newTodoList)
  }

  const unCompleteTodo = index => {
    const newTodoList = [...todoList]
    newTodoList[index].completed = false
    setTodoList(newTodoList)
  }

  const removeTodo = index => {
    const newTodoList = [...todoList]
    newTodoList.splice(index, 1)
    setTodoList(newTodoList)
  }

  // BUG IS HERE
  const editTodo = index => {
    const newTodoList = todoList
    newTodoList[index].editing = true
    setTodoList(newTodoList)
  }

  const setTodo = (index, text) => {
    const newTodoList = [...todoList]
    newTodoList.splice(index, 1, { text })
    newTodoList[index].editing = false
    setTodoList(newTodoList)
  }

  if (todoList.length > 0) {
    return (
      <div className="app">
        <div className="todo-list bg-white shadow-md rounded px-8 pt-4 pb-8 mb-4">
          <h1 style={{ textAlign: 'center' }}><strong>My Todos</strong></h1>
          {todoList.map((todo, index) => (
            <Todo
              key={todo.id}
              index={index}
              todo={todo}
              completeTodo={completeTodo}
              unCompleteTodo={unCompleteTodo}
              removeTodo={removeTodo}
              editTodo={editTodo}
              editing={todoList[index].editing}
              setTodo={setTodo}
            />
          ))}
        </div>
        <AddTodo addTodo={addTodo} />
      </div>
    )
  }
  else return (
    <div className="app">
      <div className="todo-list bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" style={{ textAlign: 'center' }}>
        No todos here. Try adding one!
      </div>
      <div>
        <AddTodo addTodo={addTodo} />
      </div>
    </div>
  )
}

export default App

//# sourceMappingURL=/src/App.js.map
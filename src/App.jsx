//jsx
import { useState, useEffect } from "react"
import { db } from "./firebase"
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore"

function App(){
  const [tasks, setTasks] = useState([])
  const [newTaskText, setNewTaskText] = useState("")
  const [editingID, setEditingID] = useState(null)
  const [editText, setEditText] = useState("")

  useEffect(() => { 
    async function fetchTasks() {
      const querySnapshot = await getDocs(collection(db, "tasks")) // await - pause this function until data comes.
      const loadedTasks = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }))
      setTasks(loadedTasks)      
    }
    fetchTasks()
  }, []) // [] means , run only once, not on every re-render.

  async function addTask(e) { // aysnc - wait for slow operations.
    e.preventDefault() //prevent to reload page
    if (newTaskText.trim() === "") return // trim removes leading/trailing whitespace.

    const docRef = await addDoc(collection(db, "tasks"),{ // addDoc creates a new doc.
       text: newTaskText,
       done: false,
    })
    setTasks([...tasks, {id: docRef.id, text: newTaskText, done: false}])
    setNewTaskText("")
  }

  function startEditing(task){
    setEditingID(task.id)
    setEditText(task.text)
  }

  async function saveEdit(id) {
    if (editText.trim() === "") return
    await updateDoc(doc(db, "tasks", id), {text: editText})
    setTasks(
      tasks.map((task) =>
        task.id === id ? {...task, text: editText } : task
      )
    )
    setEditingID(null)
  }

  async function toggleDone(id, currentDone) {
    await updateDoc(doc(db, "tasks", id), { done: !currentDone})
    setTasks(
      tasks.map((task) =>
      task.id === id ? {...task, done: !currentDone } :task // a ternary operator
      )
    )
  }

  async function deleteTask(id) {
    await deleteDoc(doc(db, "tasks", id))
    setTasks(tasks.filter((task) => task.id !== id)) // filter() -> array method, returns a new array, never mutates.
  }

  return (
    <div>
      <h1>Journal Flow</h1>

      <form onSubmit={addTask}>
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)} // e is the event object
          placeholder="Add a task..."
        />
          <button type="submit">Add</button>
      </form>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
             <input
               type="checkbox"
               checked={task.done}
               onChange={() => toggleDone(task.id, task.done)}
             />
             {editingID === task.id ? ( // conditional rendering
              <>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button onClick={() => saveEdit(task.id)}>Save</button>
                </>
             ) : (
              <>
                {task.text}
                <button onClick={() => startEditing(task)}>Edit</button>
              </>
             )}
              <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
//jsx
import { useState, useEffect } from "react"
import { auth, db } from "./firebase"
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore"
import { onAuthStateChanged, signOut } from "firebase/auth"
import Login from "./Login"

function App(){
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [tasks, setTasks] = useState([])
  const [newTaskText, setNewTaskText] = useState("")
  const [editingID, setEditingID] = useState(null)
  const [editText, setEditText] = useState("")
  const [newDueDate, setNewDueDate] = useState("")
  const [newPriority, setNewPriority] = useState("Medium")

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setAuthLoading(false)
    })
    return () => unsubscribe()
  }, []) // [] means , run only once, not on every re-render.

  useEffect(() => {
    if (!user) return
    async function fetchTasks() {
      const q = query(collection(db, "tasks"), where("uid", "==", user.uid))
      const querySnapshot = await getDocs(q) // await - pause this function until data comes.
      const loadedTasks = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }))
      setTasks(loadedTasks)
    }
    fetchTasks()
  }, [user])

  async function addTask(e) { // aysnc - wait for slow operations.
    e.preventDefault() //prevent to reload page
    if (newTaskText.trim() === "") return // trim removes leading/trailing whitespace.

    const docRef = await addDoc(collection(db, "tasks"),{ // addDoc creates a new doc.
       text: newTaskText,
       done: false,
       dueDate: newDueDate,
       priority: newPriority,
       uid: user.uid,
    })
    setTasks([...tasks,
       {
        id: docRef.id,
        text: newTaskText,
        done: false,
        dueDate: newDueDate,
        priority: newPriority,
        uid: user.uid
      },
    ])
    setNewTaskText("")
    setNewDueDate("")
    setNewPriority("Medium")
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

  if (authLoading) return <p>Loading...</p>
  if (!user) return <Login />

  return (
    <div>
      <h1>Journal Flow</h1>
      <button onClick={() => signOut(auth)}>Log out</button>

      <form onSubmit={addTask}>
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)} // e is the event object
          placeholder="Add a task..."
        />
        <input
          type="date"
          value={newDueDate}
          onChange={(e) => setNewDueDate(e.target.value)}
          />
        <select
          value={newPriority}
          onChange={(e) => setNewPriority(e.target.value)}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
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
                {task.dueDate && <span> (due {task.dueDate})</span>}
                {task.priority && (
                  <span style={{ color: priorityColor(task.priority), marginLeft: "6px"}}>
                    [{task.priority}]
                  </span>
                )}
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

function priorityColor(priority) { // derived value
  if (priority === "High") return "red"
  if (priority === "Low") return "green"
  return "orange"
}

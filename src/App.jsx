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

function App() {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [tasks, setTasks] = useState([])
  const [newTaskText, setNewTaskText] = useState("")
  const [editingID, setEditingID] = useState(null)
  const [editText, setEditText] = useState("")
  const [newDueDate, setNewDueDate] = useState("")
  const [dateFocused, setDateFocused] = useState(false)
  const [newPriority, setNewPriority] = useState("")

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

  async function addTask(e) {
    // aysnc - wait for slow operations.
    e.preventDefault() //prevent to reload page
    if (newTaskText.trim() === "") return // trim removes leading/trailing whitespace.
    if (!newPriority) return // submit if no priority chosen

    const docRef = await addDoc(collection(db, "tasks"), {
      // addDoc creates a new doc.
      text: newTaskText,
      done: false,
      dueDate: newDueDate,
      priority: newPriority,
      uid: user.uid,
    })
    setTasks([
      ...tasks,
      {
        id: docRef.id,
        text: newTaskText,
        done: false,
        dueDate: newDueDate,
        priority: newPriority,
        uid: user.uid,
      },
    ])
    setNewTaskText("")
    setNewDueDate("")
    setNewPriority("")
  }

  function startEditing(task) {
    setEditingID(task.id)
    setEditText(task.text)
  }

  async function saveEdit(id) {
    if (editText.trim() === "") return
    await updateDoc(doc(db, "tasks", id), { text: editText })
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, text: editText } : task,
      ),
    )
    setEditingID(null)
  }

  async function toggleDone(id, currentDone) {
    await updateDoc(doc(db, "tasks", id), { done: !currentDone })
    setTasks(
      tasks.map(
        (task) => (task.id === id ? { ...task, done: !currentDone } : task), // a ternary operator
      ),
    )
  }

  async function deleteTask(id) {
    await deleteDoc(doc(db, "tasks", id))
    setTasks(tasks.filter((task) => task.id !== id)) // filter() -> array method, returns a new array, never mutates.
  }

  if (authLoading)
    return <p className="text-center mt-10 text-gray-500">Loading...</p>
  if (!user) return <Login />

  return (
    <div className="min-h-screen bg-[#F4F6FB] flex justify-center px-4 py-10">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-indigo-700">
              Journal Flow
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Your Daily Task Journal
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Welcome, {user.email}</p>
            <button
              onClick={() => signOut(auth)}
              className="text-sm text-indigo-600 hover:underline mt-1"
            >
              Log out
            </button>
          </div>
        </div>

        <form
          onSubmit={addTask}
          className="bg-white rounded-xl shadow-sm p-4 flex flex-wrap gap-3 mb-6"
        >
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)} // e is the event object
            placeholder="Add a task..."
            className="flex-1 min-w-[160px] border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type={dateFocused || newDueDate ? "date" : "text"} // dynamic attribute
            value={newDueDate}
            onFocus={() => setDateFocused(true)}
            onBlur={() => setDateFocused(false)}
            onChange={(e) => setNewDueDate(e.target.value)}
            placeholder="Select a Date"
            className="border border-gray-200 rounded-lg px-3 py-2 text-gray-600"
          />
          <select
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-gray-600"
          >
            <option value="" disabled>
              Select Priority
            </option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Add
          </button>
        </form>

        <ul className="space-y-3">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`bg-white rounded-lg shadow-sm p-4 flex items-center gap-3 ${priorityBorderClass(task.priority)}`}
            >
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => toggleDone(task.id, task.done)}
                className="w-5 h-5 accent-indigo-600"
              />
              {editingID === task.id ? ( // conditional rendering
                <div className="flex flex-1 gap-2">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-1"
                  />
                  <button
                    onClick={() => saveEdit(task.id)}
                    className="text-indigo-600 font-medium hover:underline"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex-1">
                  <span
                    className={
                      task.done ? "line-through text-gray-400" : "text-gray-800"
                    }
                  >
                    {task.text}
                  </span>
                  {task.dueDate && (
                    <span className="ml-2 text-xs text-gray-400">
                      {" "}
                      (due {task.dueDate})
                    </span>
                  )}
                  {task.priority && (
                    <span className="ml-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                      {task.priority}
                    </span>
                  )}
                </div>
              )}

              {editingID !== task.id && (
                <button
                  onClick={() => startEditing(task)}
                  className="text-sm text-gray-400 hover:text-indigo-600"
                >
                  Edit
                </button>
              )}
              <button
                onClick={() => deleteTask(task.id)}
                className="text-sm text-gray-400 hover:text-red-500"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default App

function priorityBorderClass(priority) {
  // derived value
  if (priority === "High") return "border-2 border-red-400"
  if (priority === "Low") return "border-2 border-green-400"
  return "border-2 border-amber-400"
}

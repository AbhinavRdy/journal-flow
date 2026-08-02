import { useState } from "react"
import { auth } from "./firebase"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  async function handleLogin(e) {
    e.preventDefault()
    setError("")
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleSignup(e) {
    e.preventDefault()
    setError("")
    try {
      await createUserWithEmailAndPassword(auth, email, password)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/cover.jpg')" }}
      />
      <div className="absolute inset-0 bg-indigo-950/60" />

      <div className="relative z-10">
        <header className="max-w-6xl mx-auto px-8 py-8">
          <span className="text-2xl font-bold text-white tracking-tight">
            Journal Flow
          </span>
        </header>

        <main className="max-w-6xl mx-auto px-8 py-12 flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 text-white">
            <h1 className="text-5xl font-bold tracking-tight mb-6 drop-shadow-md">
              Your day,
              <br />
              one page at a time.
            </h1>
            <p className="text-indigo-100 text-lg mb-8 max-w-md drop-shadow-sm">
              Journal Flow keeps your tasks organized with due dates,
              priorities, and a clear view of what's done — private to your
              account, always up to date.
            </p>
            <ul className="space-y-3 text-indigo-100">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                Due dates and priority levels
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                Your tasks, private to your account
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                Simple, distraction-free interface
              </li>
            </ul>
          </div>

          <div className="flex-1 w-full max-w-sm bg-white/95 backdrop-blur rounded-xl shadow-xl p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              Welcome back
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              Log in or create an account
            </p>

            <form className="flex flex-col gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button
                onClick={handleLogin}
                className="bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Log In
              </button>
              <button
                onClick={handleSignup}
                className="border border-indigo-600 text-indigo-600 py-2 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
              >
                Sign Up
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Login

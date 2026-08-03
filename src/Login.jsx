import { useState } from "react"
import { auth } from "./firebase"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth"

function Login() {
  const [mode, setMode] = useState("login") // "login" or "signup"
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password)
      } else {
        await createUserWithEmailAndPassword(auth, email, password)
      }
    } catch (err) {
      setError(err.message)
    }
  }

  function toggleMode() {
    setMode(mode === "login" ? "signup" : "login")
    setError("")
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

          <div className="flex-1 w-full max-w-sm card p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              {mode === "login"
                ? "Log in to your task journal"
                : "Start your task journal"}
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="input-field"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="input-field"
              />

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button type="submit" className="btn-primary">
                {mode === "login" ? "Log In" : "Create Account"}
              </button>
            </form>

            <p className="text-sm text-gray-500 mt-4 text-center">
              {mode === "login" ? (
                <>
                  Don't have an account?{" "}
                  <button
                    onClick={toggleMode}
                    className="text-indigo-600 font-medium hover:underline"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={toggleMode}
                    className="text-indigo-600 font-medium hover:underline"
                  >
                    Log in
                  </button>
                </>
              )}
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Login

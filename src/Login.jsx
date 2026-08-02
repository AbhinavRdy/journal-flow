// jsx

import { useState } from "react"
import { auth } from "./firebase"
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
} from "firebase/auth"

function Login(){
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

    return(
        <div>
            <h1>Journal Flow - Login</h1>
            <form>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                <button onClick={handleLogin}>Log In</button>
                <button onClick={handleSignup}>Sign Up</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    )
}

export default Login

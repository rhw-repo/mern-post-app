/* temporary signup, replace & avoid user details in local storage */

import { useState } from "react";
import { useSignup } from "../hooks/useSignup";

const Signup = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { signup, error, isLoading } = useSignup()

    const handleSubmit = async (e) => {
        e.preventDefault()

        await signup(email, password)
    }

    return (
        <form className="signup" onSubmit={handleSubmit}>
            <h1>Create your <br></br>account here</h1>
            <label>Email*</label>
            <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
            />
            <label>Password*</label>
            <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
            />

            <div className="btn">
                <button disabled={isLoading}>Signup</button>
                {error && <div className="error">{error}</div>}
            </div>
        </form>
    )
}

export default Signup;
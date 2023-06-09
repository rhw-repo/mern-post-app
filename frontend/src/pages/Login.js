/* TODO:
temporary log in, replace with SSO & avoid user details in local storage */

import { useState } from "react";
import { useLogin } from "../hooks/useLogin";

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { login, error, isLoading } = useLogin()

    const handleSubmit = async (e) => {
        e.preventDefault()

        await login(email, password)
    }

    return (
        <form className="login" onSubmit={handleSubmit}>
            <h1>Welcome. Log in here</h1>
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
                <button disabled={isLoading}>
                    Login
                </button>
                {error && <div className="error">{error}</div>}
            </div>
        </form>
    )
}

export default Login
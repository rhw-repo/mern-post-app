/* TODO:
temporary log in, replace with SSO & avoid user details in local storage */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { login, error, isLoading } = useLogin()

    const handleSubmit = async (e) => {
        e.preventDefault()

        await login(email, password)
    }

    const navigate = useNavigate()

    const goToSignup = () => {
        navigate("/Signup")
    }

    return (
        <>
            <form className="login" onSubmit={handleSubmit}>
                <h1>Welcome. Login here:</h1>
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

                <div >
                    <button className="login_btn" disabled={isLoading}>
                        Login
                    </button>
                    {error && <div className="error">{error}</div>}
                </div>
            </form>
            <div className="switch_form_btns">
                <h3>No account yet? Create one now:</h3>
                <button className="switch_form_btn" onClick={goToSignup}>Signup</button>
            </div>
        </>
    )
}

export default Login
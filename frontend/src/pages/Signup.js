/* temporary signup, replace & avoid user details in local storage */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignup } from "../hooks/useSignup";

const Signup = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { signup, error, isLoading } = useSignup()

    const handleSubmit = async (e) => {
        e.preventDefault()

        await signup(email, password)
    }

    const navigate = useNavigate()

    const goToLogin = () => {
        navigate("/Login")
    }
    return (
        <>
            <form className="signup" onSubmit={handleSubmit}>
                <h1>Create your account here:</h1>
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
                    <button className="signup_btn" disabled={isLoading}>
                        Signup
                    </button>
                    {error && <div className="error">{error}</div>}
                </div>
            </form>
            <div className="switch_form_btns">
                <h3>Click below if you already have an account:</h3>
                <button className="switch_form_btn" onClick={goToLogin}>Login</button>
            </div>
        </>
    )
}

export default Signup;
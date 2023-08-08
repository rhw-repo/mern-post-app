/* TODO:
temporary log in, replace with SSO & avoid user details in local storage */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightToBracket, faUserPlus } from "@fortawesome/free-solid-svg-icons"

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    // form has server-side & client-side validation
    const { login, error, isLoading } = useLogin()

    // client-side validation prevent empty fields 
    const [isFormValid, setIsFormValid] = useState(false)
    const [trySubmit, setTrySubmit] = useState(false)

    useEffect(() => {
        console.log("Email", email)
        console.log("Password", password)
        if (email && password) {
            setIsFormValid(true)
        } else {
            setIsFormValid(false)
        }
    }, [email, password])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!isFormValid) {
            setTrySubmit(true)
            return
        }

        await login(email, password)
    }

    const navigate = useNavigate()

    const goToSignup = () => {
        navigate("/Signup")
    }

    // client-side - sets frontend error display according to missing fields
    const missingFields = () => {
        let fields = []
        if (!email) fields.push("Email")
        if (!password) fields.push("Password")
        return fields
    }

    const loginIcon = <FontAwesomeIcon icon={faRightToBracket} />
    const signupIcon = <FontAwesomeIcon icon={faUserPlus} />

    return (
        <>
            <form className="login" onSubmit={handleSubmit}>
                {(trySubmit && !isFormValid) || error ? (
                    <div className="error">
                        {trySubmit && !isFormValid ? (
                            <>
                                Please fill in the following fields: {missingFields().join(", ")}
                            </>
                        ) : (
                            error
                        )}
                    </div>
                ) : null}

                <h1>Welcome. Login here:</h1>
                <label>Email*</label>
                <input
                    id="email"
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    className={(trySubmit && !email) || missingFields().includes("email") ? "error" : "primary"}
                />
                <label>Password*</label>
                <input
                    id="password"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    className={(trySubmit && !password) || missingFields().includes("password") ? "error" : "primary"}
                />

                <div >
                    <button
                        className="login_btn"
                        disabled={isLoading}
                    >
                        {loginIcon} Login
                    </button>
                    {error && <div className="error">{error}</div>}
                </div>
            </form>
            <div className="switch_form_btns">
                <h3>Need an account?</h3>
                <button
                    className="switch_form_btn"
                    onClick={goToSignup}
                >
                    {signupIcon} Signup
                </button>
            </div>
        </>
    )
}

export default Login
/* TODO:
temporary log in, replace with SSO & avoid user details in local storage */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../../hooks/useLogin"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightToBracket, faUserPlus } from "@fortawesome/free-solid-svg-icons"
import styles from "./Login.module.css"

// custom hook manages input fields error handling
const useInput = (initialValue, externalError) => {
    const [value, setValue] = useState(initialValue)
    const [error, setError] = useState(null)

    // update error state if server-side error
    useEffect(() => {
        if (externalError) {
            setError(externalError)
        }
    }, [externalError])
    // clear display (validation) error message when user re-types in field
    const handleInputChange = (e) => {
        setValue(e.target.value)

        if (error) {
            setError(null)
        }
    }

    return {
        value,
        error,
        handleInputChange
    }
}

const Login = () => {
    // imports from custom useLogin hook
    const { login, error, isLoading, clearError } = useLogin()
    // custom input hooks for email and password 
    const emailInput = useInput("", error)
    const passwordInput = useInput("", error)
    // state for email and password values
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")


    // client-side validation prevent submission with empty fields 
    const [isFormValid, setIsFormValid] = useState(false)
    const [trySubmit, setTrySubmit] = useState(false)

    // update form validity based on email and password prescence
    useEffect(() => {
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

    // client-side - set error display according to missing fields 
    const missingFields = () => {
        let fields = []
        if (!email) fields.push("Email")
        if (!password) fields.push("Password")
        return fields
    }
    // icons for buttons
    const loginIcon = <FontAwesomeIcon icon={faRightToBracket} />
    const signupIcon = <FontAwesomeIcon icon={faUserPlus} />

    return (
        <>
        <div className={styles.loginWrapper}>
            <form className={`${styles.loginForm} login-form`} onSubmit={handleSubmit}>
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

                <h1 className="login-signup-title">Hello, log in</h1>
                <label>Email*</label>
                <input
                    aria-label="Enter your email address"
                    id="email"
                    type="email"
                    autoComplete="off"
                    onChange={(e) => {
                        setEmail(e.target.value)
                        emailInput.handleInputChange(e)
                        clearError()
                    }}

                    value={email}
                    className={(trySubmit && !email) || emailInput.error ? "error" : "primary"}
                />
                <label>Password*</label>
                <input
                    aria-label="Enter your password"
                    id="password"
                    type="password"
                    autoComplete="off"
                    onChange={(e) => {
                        setPassword(e.target.value)
                        passwordInput.handleInputChange(e)
                        clearError()
                    }}
                    value={password}
                    className={(trySubmit && !password) || passwordInput.error ? "error" : "primary"}
                />

                <div >
                    <button
                        className="login-btn"
                        disabled={isLoading}
                    >
                        {loginIcon} Login
                    </button>
                    {error && <div className="error">{error}</div>}
                </div>
            </form>
            <div className={`${styles.loginSwitchFormsBtns} switch-form-btns`}>
                <div className="switch-form-text-prompt">Need an account?</div>
                <button
                    className="switch-form-btn"
                    onClick={goToSignup}
                >
                    {signupIcon} Signup
                </button>
            </div>
            </div>
        </>
    )
}

export default Login
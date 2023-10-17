/* temporary signup, replace & avoid user details in local storage */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSignup } from "../../hooks/useSignup";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus, faRightToBracket } from "@fortawesome/free-solid-svg-icons"

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

const Signup = () => {

    // imports from custom useSignin hook
    const { signup, error, isLoading, clearError } = useSignup()
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


        await signup(email, password)
    }

    const navigate = useNavigate()

    const goToLogin = () => {
        navigate("/Login")
    }

    // client-side - set error display according to missing fields 
    const missingFields = () => {
        let fields = []
        if (!email) fields.push("Email")
        if (!password) fields.push("Password")
        return fields
    }

    const signupIcon = <FontAwesomeIcon icon={faUserPlus} />
    const loginIcon = <FontAwesomeIcon icon={faRightToBracket} />

    return (
        <>
            <form className="signup-form" onSubmit={handleSubmit}>
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

                <h1>Create your account here:</h1>
                <label>Email*</label>
                <input
                    aria-label="Enter your email address"
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
                        className="signup-btn"
                        disabled={isLoading}
                    >
                        {signupIcon} Signup
                    </button>
                    {error && <div className="error">{error}</div>}
                </div>
            </form>
            <div className="switch-form-btns">
                <div className="switch-form-text-prompt">Click below if you already have an account:</div>
                <button
                    className="switch-form-btn"
                    onClick={goToLogin}
                >
                    {loginIcon} Login
                </button>
            </div>
        </>
    )
}

export default Signup;
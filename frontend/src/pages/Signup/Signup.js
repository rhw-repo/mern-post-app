/* temporary signup, replace & avoid user details in local storage */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSignup } from "../../hooks/useSignup";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus, faRightToBracket } from "@fortawesome/free-solid-svg-icons"
import styles from "./Signup.module.css"

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

    // set up for aria-live region when switching between
    // Login & Signup forms
    const [liveMessage, setLiveMessage] = useState("")

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

    /* Navigate & screen reader announcement of new page*/
    const goToLogin = () => {
        setLiveMessage("Now on the login form.")
        setTimeout(() => {
            navigate("/Login")
        }, 100)
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
            <main className={styles.signupWrapper}>
                <form className={`${styles.signupForm} signup-form`} onSubmit={handleSubmit}>
                    <div aria-live="polite">
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
                    </div>
                    <h2 className="login-signup-title">Signup here:</h2>
                    <label htmlFor="email">Email*</label>
                    <input
                        aria-label="Signup form: focused on email input box."
                        type="email"
                        id="email"
                        autoComplete="off"
                        onChange={(e) => {
                            setEmail(e.target.value)
                            emailInput.handleInputChange(e)
                            clearError()
                        }}
                        value={email}
                        className={(trySubmit && !email) || emailInput.error ? "error" : "primary"}
                        aria-required
                    />
                    <label htmlFor="password">Password*</label>
                    <input
                        aria-label="Signup form: focused on password input box."
                        type="password"
                        id="password"
                        autoComplete="off"
                        onChange={(e) => {
                            setPassword(e.target.value)
                            passwordInput.handleInputChange(e)
                            clearError()
                        }}
                        value={password}
                        className={(trySubmit && !password) || passwordInput.error ? "error" : "primary"}
                        aria-required
                    />

                    <div >
                        <button
                            className={`${styles.signupButton} signup-btn`}
                            disabled={isLoading}
                        >
                            {signupIcon} Signup
                        </button>
                        {error && <div className="error">{error}</div>}
                    </div>
                </form>
                <section className={`${styles.signupSwitchFormsBtns} switch-form-btns`}>
                    <div aria-live="polite" aria-atomic="true" className={styles.hiddenAriaLiveMessages}>
                        {liveMessage}
                    </div>
                    <div className="switch-form-text-prompt">Already have an account?</div>
                    <button
                        className="switch-form-btn"
                        onClick={goToLogin}
                    >
                        {loginIcon} Login
                    </button>
                </section>
            </main>
        </>
    )
}

export default Signup;
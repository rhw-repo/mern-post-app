// Note temporary auth, replace with SSO as local storage insecure for user
import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useSignup = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const { dispatch } = useAuthContext()

    /* exported for controlling display server-side validation 
    error messages when redundant in Signup*/
    const clearError = () => {
        setError(null)
    }

    const signup = async (email, password) => {
        setIsLoading(true)
        setError(null)

        const response = await fetch("/api/user/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        })
        const json = await response.json()

        if (!response.ok) {
            setIsLoading(false)
            setError(json.error)
        }
        if (response.ok) {
            // save the user to local storage- insecure, temporary, replace with SSO
            localStorage.setItem("user", JSON.stringify(json))
            // update AuthContext
            dispatch({ type: "LOGIN", payload: json })

            setIsLoading(false)
        }
    }

    return { signup, isLoading, error, clearError }
}


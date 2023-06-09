/* TODO:
temporary log in, replace with SSO & avoid user details in local storage */

import { createContext, useReducer, useEffect } from "react";

export const AuthContext = createContext()

export const authReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN":
            return { user: action.payload }
        case "LOGOUT":
            return { user: null }
        default:
            return (state)
    }
}

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null
    })

    // parses user as stored as JSON string in local storage
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"))

        if (user) {
            dispatch({ type: "LOGIN", payload: user })
        }
    }, [])
    // console.log("AuthContext state: ", state)
    
    // TODO consider useMemo hook wrapper, avoid code smell
    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    )
}


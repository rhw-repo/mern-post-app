/* invoke to destructure the user from the context object and use dispatch 
function to perform dispatches and update the state, from any component - 
avoids manually passing props multiple times */

import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

export const useAuthContext = () => {
    const context = useContext(AuthContext)

    if (!context) {
        throw Error("useAuthContext must be used within AuthContextProvider")
    }

    return context
}
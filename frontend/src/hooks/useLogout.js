/* Note temporary auth, replace with SSO as local storage inappropriate for user,
 currently instead of server request, update global state and delete token 
from local storage */
import { useAuthContext } from "./useAuthContext";
import { useMaterialsContext } from "./useMaterialsContext";
import { useState } from "react";

export const useLogout = () => {

    const { dispatch } = useAuthContext()
    const { dispatch: dispatchMaterials } = useMaterialsContext()
    const [logoutError, setLogoutError] = useState(null);
    const logout = () => {
        // error handling for a synchronous function
        try {
            // remove user from storage 
            localStorage.removeItem("user")
            localStorage.removeItem("allTags")

            // dispatch logout action
            dispatch({ type: "LOGOUT" })
            dispatchMaterials({ type: "SET_MATERIALS", payload: null })
        }
        catch (error) {
            setLogoutError("An error occured. Please try again");
        }
    }

    return { logout, logoutError }

}
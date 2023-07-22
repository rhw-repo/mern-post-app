/* Note temporary auth, replace with SSO as local storage inappropriate for user,
 currently instead of server request, update global state and delete token 
from local storage */
import { useAuthContext } from "./useAuthContext";
import { useMaterialsContext } from "./useMaterialsContext";

export const useLogout = () => {

    const { dispatch } = useAuthContext()
    const { dispatch: dispatchMaterials } = useMaterialsContext()

    const logout = () => {
     
        // remove user from storage 
        localStorage.removeItem("user")
        localStorage.removeItem("allTags")

        // dispatch logout action
        dispatch({type: "LOGOUT"})
        dispatchMaterials({type: "SET_MATERIALS", payload: null})
    }
    
    return { logout }
    
}
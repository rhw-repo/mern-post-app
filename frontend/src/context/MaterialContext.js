import { createContext, useReducer } from "react";

export const MaterialsContext = createContext()

// keeps local state in sync with database 

export const materialsReducer = (state, action) => {

    switch (action.type) {
        case "SET_MATERIALS":
            return {
                materials: action.payload
            }
        case "CREATE_MATERIAL":
            return {
                materials: [action.payload, ...state.materials]
            }
        case "DELETE_MATERIAL":
            return {
                materials: state.materials.filter((m) => m._id !== action.payload._id)
            }
        case "UPDATE_MATERIAL":
            return {
                materials: state.workouts.filter((m) => m._id === action.payload_id)
            }
        default:
            return state
    }
}

// experiment initialised materials to array replacing materials: null in reducer
// use Reducer() hook invokes materialsReducer()
export const MaterialsContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(materialsReducer, {
        materials: []
    })

    /* object describes desired state change (type property) and any data needed to 
    achieve the change - example
    dispatch({type: "SET_MATERIALS", payload: [{}, {}]})*/
    // TODO consider useMemo hook wrapper, avoid code smell
    return (
        <MaterialsContext.Provider value={{ ...state, dispatch }}>
            {children}
        </MaterialsContext.Provider>
    )
}
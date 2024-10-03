/* Invoke to destructure the user from the context object and use dispatch 
function to perform dispatches and update the state, from any component */

import { MaterialsContext } from "../context/MaterialContext";
import { useContext } from "react";

export const useMaterialsContext = () => {
  const context = useContext(MaterialsContext);

  if (!context) {
    throw Error(
      "useMaterialsContext must be used within MaterialsContextProvider"
    );
  }

  return context;
};

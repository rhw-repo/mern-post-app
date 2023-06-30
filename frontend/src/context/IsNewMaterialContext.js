import { createContext, useState } from 'react';

export const IsNewMaterialContext = createContext();

export const IsNewMaterialProvider = ({ children }) => {
  const [isNewMaterial, setIsNewMaterial] = useState(false);

  return (
    <IsNewMaterialContext.Provider value={{ isNewMaterial, setIsNewMaterial }}>
      {children}
    </IsNewMaterialContext.Provider>
  )
}

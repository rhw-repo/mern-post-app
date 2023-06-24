import React, { createContext, useState } from "react"

const AllTagsContext = createContext()

export const AllTagsProvider = ({ children }) => {
  const [allTags, setAllTags] = useState([])

  return (
    <AllTagsContext.Provider value={{ allTags, setAllTags }}>
      {children}
    </AllTagsContext.Provider>
  )
}

export { AllTagsContext }

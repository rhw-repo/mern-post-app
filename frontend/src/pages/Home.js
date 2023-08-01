/* TODO: 
1. Write then import & render a separate component that allows search tags */

// hooks
import { useEffect, useMemo } from "react";
import { useMaterialsContext } from "../hooks/useMaterialsContext";
import { useAuthContext } from "../hooks/useAuthContext";
//import { AllTagsContext } from "../context/AllTagsContext";

// components
import Table from "../components/Table";

const Home = () => {
  const { materials, dispatch } = useMaterialsContext()
  const { user } = useAuthContext()
  //const { setAllTags } = useContext(AllTagsContext)

  // see ln 2 frontend package.json - for dev phase only, for build, point every req to endpoint 
  useEffect(() => {
    const fetchMaterials = async () => {
      console.log('fetchMaterials called')
      const response = await fetch('/api/materials', {
        headers: { "Authorization": `Bearer ${user.token}` },
      })
      const json = await response.json()

      if (response.ok) {
        dispatch({ type: "SET_MATERIALS", payload: json })
        /* destructure tags for use in allTagsContext
        const tags = json.map((material) => material.tags.flat())
        console.log(json)
        console.log("Here are the tags:")
        console.log(tags)
        //setAllTags(tags)*/
      }
    }
   
    if (user) {
      fetchMaterials()
    }

}, [dispatch, user])

  // Array of objects to pass to table (Tanstack Table v7) 
  // experiment: memoising data prevents components from recalulating unneccessary logic on every render 
  const data = useMemo(() => materials, [materials])

  console.log(data)

  if (!data) {
    return
  }

  return (
    <>
      <div className="home">
          <Table data={data} />
        </div>      
      <div>
      </div>
    </>
  )
}

export default Home
/* TODO 
add chip component for data.tags property (allow user to tag table 'entries') */

// hooks
import { useEffect, useContext, useState } from "react";
import { useMaterialsContext } from "../hooks/useMaterialsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { AllTagsContext } from "../context/AllTagsContext";

// components
import Table from "../components/Table";

const Home = () => {
  const { materials, dispatch } = useMaterialsContext()
  const { user } = useAuthContext()
  const { setAllTags } = useContext(AllTagsContext)
  // experiment to debug tags select
  const [isLoading, setIsLoading] = useState(true)


  // see line 2 package.json in frontend - for dev phase only, for build, point every req to endpoint 
  useEffect(() => {
    const fetchMaterials = async () => {
      const response = await fetch('/api/materials', {
        headers: { "Authorization": `Bearer ${user.token}` },
      })
      const json = await response.json()

      if (response.ok) {
        dispatch({ type: "SET_MATERIALS", payload: json })
        // SUCCESSFUL EXPERIMENT TO DESTRUCTURE TAGS FOR USE IN ALLTAGSCONTEXT
        const tags = json.map((material) => material.tags.flat())
        setAllTags(tags)
        setIsLoading(false)
      }
    }

    if (user) {
      fetchMaterials()
    } else {
      setIsLoading(false)
    }

  }, [dispatch, user, setAllTags])

  // Array of objects to pass to table (Tanstack Table v7) 
  const data = materials
  // console.log(data)

  if (!data) {
    return
  }

  if (isLoading) {
  return <div>Spinning up your posts...</div> 
  }

  return (
    <>
      <div className="home">
        <div className="materials">
          <Table data={data} />
        </div>
      </div>
      <div>
      </div>
    </>
  )
}

export default Home
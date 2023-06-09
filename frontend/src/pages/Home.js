/* TODO 
add chip component for data.tags property (allow user to tag table 'entries') */

// hooks
import { useEffect } from "react";
import { useMaterialsContext } from "../hooks/useMaterialsContext";
import { useAuthContext } from "../hooks/useAuthContext";

// components
import Table from "../components/Table";

const Home = () => {
  const { materials, dispatch } = useMaterialsContext()
  const { user } = useAuthContext()

  // see line 2 package.json in frontend - for dev phase only, for build, point every req to endpoint 
  useEffect(() => {
    const fetchMaterials = async () => {
      const response = await fetch('/api/materials', {
        headers: { "Authorization": `Bearer ${user.token}` },
      })
      const json = await response.json()

      if (response.ok) {
        dispatch({ type: "SET_MATERIALS", payload: json })
      }
    }

    if (user) {
      fetchMaterials()
    }

  }, [dispatch, user])

  // Array of objects to pass to table (Tanstack Table v7) 
  const data = materials
  // console.log(data)

  if (!data) {
    return
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
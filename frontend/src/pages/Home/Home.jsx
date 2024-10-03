// hooks
import { useEffect, useMemo } from "react";
import { useMaterialsContext } from "../../hooks/useMaterialsContext.jsx";
import { useAuthContext } from "../../hooks/useAuthContext.jsx";
import styles from "./Home.module.css";

// components
// import Table from "../components/Table";
import Table from "./Table.jsx";
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary.jsx";

const Home = () => {
  const { materials, dispatch } = useMaterialsContext()
  const { user } = useAuthContext()

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
      }
    }

    if (user) {
      fetchMaterials()
    }

  }, [dispatch, user])

  // Array of objects to pass to table (Tanstack Table v7) 
  const data = useMemo(() => materials, [materials])

  console.log(data)

  if (!data) {
    return
  }

  return (
    <>
      <ErrorBoundary>
        <div className={styles.home}>
          <Table data={data} />
        </div>
        <div>
        </div>
      </ErrorBoundary>
    </>
  )
}

export default Home
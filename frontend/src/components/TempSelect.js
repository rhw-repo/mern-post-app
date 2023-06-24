// rubber duck excercise to make a select for all tags from db
import { useState, useEffect } from "react";
import { useMaterialsContext } from "../hooks/useMaterialsContext";
import { useAuthContext } from "../hooks/useAuthContext";


const TempSelect = () => {

  const { materials, dispatch } = useMaterialsContext()
  const { user } = useAuthContext()

    const [existingTags, setExistingTags] = useState([])

    useEffect(() => {
        fetchTags();
    }, [])

    const fetchTags = async () => {
        try {
          const response = await fetch('/api/materials/tags')
          if (response.ok) {
            const fetchedTags = await response.json()
            console.log('Fetched tags:', fetchedTags)
            setExistingTags(fetchedTags)
          } else {
            throw new Error('Error fetching tags')
          }
        } catch (error) {
          console.error(error);
        }
      }

return (
  <>
  <h1>Dummy text</h1>
    <h1>{existingTags}</h1>
    </>
)
}

export default TempSelect;
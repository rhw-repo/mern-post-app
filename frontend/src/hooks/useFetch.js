// Note temporary auth, replace with SSO as local storage insecure for user

import { useEffect, useState } from "react";
import { useAuthContext } from "./useAuthContext";

const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [isPending, setisPending] = useState(null);
    const [error, setError] = useState(null);
    const { user } = useAuthContext()


    useEffect(() => {

       // console.log(user)

      fetch(url, {
        headers: {"Authorization": `Bearer ${user.token}`},
      })
      .then(response => {
        if (!response.ok) { 
            throw Error("could not fetch this item");
        }
        
        if(user) { 
            return response.json()
        }
      })
      .then(data => {
        setisPending(false)
        setData(data)
        setError(null)
      })
      .catch(err =>  {
        setisPending(false)
        setError(err.message)
      })
      }, [])

      return {
        data,
        isPending,
        error
      }
}
    
export default useFetch;
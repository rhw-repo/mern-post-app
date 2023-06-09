/* TODO:
1. research (& implement or reccomend) input validation, sanitisation
2. integrate with a feature/chips branch handling tags (allows user to 
apply 'labels' (tags) to their individual database documents) */

import { useState } from "react";
import { useMaterialsContext } from "../hooks/useMaterialsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import CancelButton from "./CancelButton";

const CreateNew = () => {
    const { dispatch } = useMaterialsContext()
    const { user } = useAuthContext()
    const navigate = useNavigate()

    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [tags, setTags] = useState("")
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState([])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!user) {
            setError("You must be logged in")
            return
        }

        const material = { title, body, tags }

        const response = await fetch("/api/materials", {
            method: "POST",
            body: JSON.stringify(material),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.token}`
            }
        })

        const json = await response.json()

        if (!response.ok) {
            setError(json.error)
            setEmptyFields(json.emptyFields)
        }
        if (response.ok) {
            setTitle("")
            setBody("")
            setTags("")
            setError(null)
            setEmptyFields([])
            // console.log("new material added", json)
            dispatch({ type: "CREATE_MATERIAL", payload: json })
            navigate("/");
        }
    }

    return (
        <>
            <form className="create" onSubmit={handleSubmit}>
                <h3>Add A New Piece Of Content Here:</h3>
                <label>Title:</label>
                <input
                    type="text"
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                    className={emptyFields.includes("title") ? "error" : ""}
                />
                <label>Paste content here:</label>
                <textarea
                    rows={8}
                    cols={40}
                    onChange={(e) => setBody(e.target.value)}
                    value={body}
                    className={emptyFields.includes("body") ? "error" : ""}
                />
                <label>Paste or type tags here:</label>
                <input
                    type="text"
                    onChange={(e) => setTags(e.target.value)}
                    value={tags}
                    className={emptyFields.includes("tags") ? "error" : ""}
                />
                <button>Save</button>
                {error && <div className="error">{error}</div>}
            </form>
            <CancelButton />
        </>
    )
}

export default CreateNew;
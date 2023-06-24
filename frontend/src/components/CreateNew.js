/* TODO:
1. Research (& implement or reccomend) input validation, sanitisation
2. Complete feature/chip_tags branch (user needs to apply labels to documents)-
2.1  Create custom scroll bar for tags container
2.2 Design a select / other component letting user apply pre-existing tags */

import { useState } from "react";
import { useMaterialsContext } from "../hooks/useMaterialsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import CancelButton from "./CancelButton";

const CreateNew = ({ allTags }) => {
    const { dispatch } = useMaterialsContext()
    const { user } = useAuthContext()
    const navigate = useNavigate()

    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [tags, setTags] = useState([])
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
            setTags("[]")
            setError(null)
            setEmptyFields([])
            /*  console.log("Data sent to backend:", {
               title,
                  body,
                  tags,
               })*/
            dispatch({ type: "CREATE_MATERIAL", payload: json })
            navigate("/");
        }
    }

    const deleteTag = (index) => {
        setTags(prevState => prevState.filter((tag, i) => i !== index))
    }

    console.log(allTags)
    
    return (
        <>
        <h1>{allTags}</h1>
        <h1>dummy text</h1>
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
                    rows={4}
                    cols={40}
                    onChange={(e) => setBody(e.target.value)}
                    value={body}
                    className={emptyFields.includes("body") ? "error" : ""}
                />
                <label>Paste or type tags here:</label>

                <div className="input-tags-container">
                    {tags.map((tag, index) => (
                        <span key={index} className="tag-chip">
                            {tag}
                            <button onClick={() => deleteTag(index)}>X</button>
                        </span>
                    ))}
                    <input
                        type="text"
                        placeholder="Enter tags separated by commas"
                        onChange={(e) => setTags(e.target.value.split(/,\s*/))}
                        value={Array.isArray(tags) ? tags.join(", ") : ""}
                        className={`${emptyFields.includes("tags") ? "error" : ""}`}
                    />
                    <input
                        className="edit_tags tag-chip"
                        type="text"
                        id="tags"
                        value={tags.join(", ")}
                        onChange={(e) => setTags(
                            e.target.value.split(", ").map((tag) => tag.trim())
                        )}
                    />
                </div>

                <div className="read_edit_create_btns">
                    <CancelButton />
                    <button className="save_btn">Save</button>
                    {error && <div className="error">{error}</div>}
                </div>
            </form>

        </>
    )
}

export default CreateNew;
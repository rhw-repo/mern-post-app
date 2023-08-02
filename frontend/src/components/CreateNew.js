/* TODO 
1.Research (& implement or reccomend) input validation, sanitisation
*/
import { useState } from "react";
import { useMaterialsContext } from "../hooks/useMaterialsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import CancelButton from "./CancelButton";
import ExperimentalAllTagsSelect from "./ExperimentalAllTagsSelect";
import toast from "react-hot-toast"

const CreateNew = () => {
    const { dispatch } = useMaterialsContext()
    const { user } = useAuthContext()
    const navigate = useNavigate()

    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState([])

    const [selectedTags, setSelectedTags] = useState([])

    // function to handle changes to the selected tags
    const handleTagsChange = (tags) => {
        setSelectedTags(tags)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!user) {
            setError("You must be logged in")
            return
        }

        const material = { title, body, tags: selectedTags }

        // Log material object being sent to the backend
        console.log('Material sent to the backend:', material);

        const response = await fetch("/api/materials", {
            method: "POST",
            body: JSON.stringify(material),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.token}`
            }
        })

        const json = await response.json()

        // Log the response received from the backend
        console.log('Response received from the backend:', json)

        if (!response.ok) {
            setError(json.error)
            setEmptyFields(json.emptyFields)
        }

        if (response.ok) {
            setTitle("")
            setBody("")
            setError(null)
            setEmptyFields([])
            dispatch({ type: "CREATE_MATERIAL", payload: json })
            navigate("/")
            toast.success("Your work is safely saved!")
        }
    }

    const customStyles = {
        outline: "none",
    }

    return (
        <>
            <form className="create" onSubmit={handleSubmit}>
                <label className="document_form_headings ">
                    Type or paste the title here:
                    </label>
                <textarea
                    rows={3}
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                    className={emptyFields.includes("title") ? "error" : "primary"}
                    style={customStyles}
                />
                <label className="document_form_headings ">Type or paste content here:</label>
                <textarea
                    rows={8}
                    cols={40}
                    onChange={(e) => setBody(e.target.value)}
                    value={body}
                    className={emptyFields.includes("body") ? "error" : ""}
                    style={customStyles}
                />
                <label className="document_form_headings ">Add tags here:</label>
                <div className="tags_section_container">
                    <div className="existing_tags_container">
                        <ExperimentalAllTagsSelect onTagsChange={handleTagsChange} />
                    </div>
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
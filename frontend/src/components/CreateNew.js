/* Validation: without all fields completed, form cannot submit frontend & 
backend also rejects if detect same. Both display styled error messages */

import { useEffect, useState } from "react";
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
    const [content, setContent] = useState("")
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState([])

    const [selectedTags, setSelectedTags] = useState([])
    const [trySubmit, setTrySubmit] = useState(false)

    // prevent form submission with empty fields
    const [isFormValid, setIsFormValid] = useState(false)

    useEffect(() => {
        console.log('Title:', title)
        console.log('Content', content)
        console.log('Selected tags', selectedTags)
        if (title && content && selectedTags.length > 0) {
            setIsFormValid(true)
        } else {
            setIsFormValid(false)
        }
    }, [title, content, selectedTags])

    // Handles changes to the selected tags
    const handleTagsChange = (tags) => {
        if (tags && tags.length) {
            setSelectedTags(tags)
        } else {
            // Update only if selectedTags not already empty array
            // Also prevent submission if all selected tags deleted 
            if (selectedTags.length !== 0) {
                 setSelectedTags([])
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!user) {
            setError("You must be logged in")
            return
        }

        if (!isFormValid) {
            setTrySubmit(true)
            return
        }

        const material = { title, content, tags: selectedTags }

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
            setContent("")
            setError(null)
            setEmptyFields([])
            dispatch({ type: "CREATE_MATERIAL", payload: json })
            navigate("/")
            toast.success("Your work is safely saved!")
        }
    }

    // sets frontend validation error display according to missing fields
    const missingFields = () => {
        let fields = []
        if (!title) fields.push("Title")
        if (!content) fields.push("Content")
        if (selectedTags.length === 0) fields.push("Tags")
        return fields
    }

    return (
        <>
            <form className="create" onSubmit={handleSubmit}>
                {(trySubmit && !isFormValid) || error ? (
                    <div className="error">
                        {trySubmit && !isFormValid ? (
                            <>
                                Please fill in the following fields: {missingFields().join(", ")}
                            </>
                        ) : (
                            error
                        )}
                    </div>
                ) : null}

                <label className="document_form_headings ">
                    Type or paste the title here:
                </label>
                <textarea
                    rows={3}
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                    className={(trySubmit && !title) || emptyFields.includes("title") ? "error" : "primary"}

                />
                <label className="document_form_headings ">Type or paste content here:</label>
                <textarea
                    rows={8}
                    onChange={(e) => setContent(e.target.value)}
                    value={content}
                    className={(trySubmit && !content) || emptyFields.includes("content") ? "error" : "primary"}
                />
                <label className="document_form_headings ">Add tags here:</label>
                <div className="tags_section_container">
                    <div className="existing_tags_container">
                        <div className={trySubmit && selectedTags.length === 0 ? "error" : ""}>
                            <ExperimentalAllTagsSelect onTagsChange={handleTagsChange} />
                        </div>
                    </div>
                </div>
                <div className="content_detail_edit_create_btns">
                    <CancelButton />
                    <button className="save_btn" onClick={handleSubmit}>Save</button>

                </div>
            </form>

        </>
    )
}

export default CreateNew;
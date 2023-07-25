import { useState } from "react";
import { useMaterialsContext } from "../hooks/useMaterialsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import CancelButton from "./CancelButton";
import ExperimentalAllTagsSelect from "./ExperimentalAllTagsSelect";
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons"

const CreateNew = () => {
    const { dispatch } = useMaterialsContext()
    const { user } = useAuthContext()
    const navigate = useNavigate()

    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [selectedTags, setSelectedTags] = useState([]);
    /* set state to null for error property defined in 
       materialController.js in backend */
    const [error, setError] = useState(null)
    // tracks if any fields are not completed 
    const [emptyFields, setEmptyFields] = useState([])
   

   const handleTagsChange = (tags) => {
     setSelectedTags(tags);
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
           // toast.error("Sorry, that save did not go so well, please try again")
        }

        if (response.ok) {
            setTitle("")
            setBody("")
            setError(null)
            setEmptyFields([])
            dispatch({ type: "CREATE_MATERIAL", payload: json })
            navigate("/");
			toast.success("Your work is safely saved!")
        } 
    }
	
	 const saveIcon = <FontAwesomeIcon icon={faFloppyDisk} />

// css class 'errror' only applies if emptyFields is true
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
                    rows={3}
                    cols={40}
                    onChange={(e) => setBody(e.target.value)}
                    value={body}
                    className={emptyFields.includes("body") ? "error" : ""}
                />
                <label>Add tags here:</label>

                <div className="tags_section_container">
                    <div className="existing_tags_container">
                       <ExperimentalAllTagsSelect onTagsChange={handleTagsChange}/>
                    </div>
                </div>

                <div className="read_edit_create_btns">
                    <CancelButton />
                    <button className="save_btn">{saveIcon} Save</button>
                    { /*  // evaluate if error exists, if so, output a div which outputs the error state   */ }
                    {error && <div className="error">{error}</div>}
                </div>
            </form>
            
        </>
    )
}

export default CreateNew;

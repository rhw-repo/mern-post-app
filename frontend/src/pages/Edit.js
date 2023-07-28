/* TODO 
1.Research (& implement or reccomend) input validation, sanitisation
*/

import { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useMaterialsContext } from "../hooks/useMaterialsContext";
import { json, useNavigate } from "react-router-dom";
import CancelButton from "../components/CancelButton";
import toast from "react-hot-toast"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons"
import ExperimentalAllTagsSelect from "../components/ExperimentalAllTagsSelect";

const Edit = ({ material }) => {
  const [title, setTitle] = useState(material.title)
  const [body, setBody] = useState(material.body)
  const [error, setError] = useState(null)
  const [emptyFields, setEmptyFields] = useState([])
  // maintain state selected options (other tags from user's doc collection)
  const [selectedTags, setSelectedTags] = useState([]);
  const { dispatch } = useMaterialsContext()
  const { user } = useAuthContext()
  const navigate = useNavigate()
  // maintain  state for existing tags 
  const [tags, setTags] = useState(material.tags)

  useEffect(() => {
    setTitle(material.title)
    setBody(material.body)
    setTags(material.tags)
  }, [material])

  const deleteTag = (index) => {
    setTags(prevState => prevState.filter((tag, i) => i !== index))
  }

  const handleTagsChange = (newTags) => {
    setSelectedTags(newTags);
  }

  /* temporary auth to replace with SSO local storage insecure for user */
  const handleSubmit = async (e) => {
    e.preventDefault()

    // merge existing and new tags
    const everyTag = Array.from(new Set([...tags, ...selectedTags]))
    const updatedMaterial = { title, body, tags: everyTag }
    const response = await fetch(`/api/materials/${material._id}`, {
      method: "PATCH",
      headers:
      {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.token}`
      },
      body: JSON.stringify(updatedMaterial),
    });

    const json = await response.json()

    if (!response.ok) {
      setError(json.error)
      setEmptyFields(json.emptyFields)
    }

    if (response.ok) {
      setError(null)
      setEmptyFields([])
      dispatch({ type: "UPDATE_MATERIAL", payload: json })
      navigate("/")
      toast.success("Your work is safely saved!")
    } else {
      toast.error("Sorry, that save did not go so well, please try again")
    }
  }

  const saveIcon = <FontAwesomeIcon icon={faFloppyDisk} />

  const customStyles = {
    outline: "none",
    fontSize: "1rem",
    maxHeight: "8rem",
  }

  return (
    <div className="edit">
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title" className="document_form_headings">Edit Title:</label>
          <textarea
            id="title"
            rows={2}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={emptyFields.includes("title") ? "error" : ""}
            style={customStyles}
          />
        </div>

        <div>
          <label htmlFor="body" className="document_form_headings">Edit Body:</label>
          <textarea
            id="body"
            rows={5}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className={emptyFields.includes("body") ? "error" : ""}
            style={customStyles}
          >
          </textarea>
        </div>

        <label htmlFor="tags" className="document_form_headings">Edit Tags:</label>
        <div className="input-tags-container">
          <ExperimentalAllTagsSelect onTagsChange={handleTagsChange} />
          <span className="document-tags">
            {tags.map((tag, index) => (
              <span key={index} className="tag-chip">
                {tag}
                <button type="button" onClick={() => deleteTag(index)}>X</button>
              </span>
            ))}
          </span>
        </div>

        <div className="read_edit_create_btns">
          <CancelButton />
          <button className="save_btn" type="submit">{saveIcon} Save</button>
        </div>
      </form>
    </div>
  )
}

export default Edit;

/* TODO 
1.Research (& implement or reccomend) input validation, sanitisation
*/

import { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
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

    if (!response.ok) {
      setError(json.error)
      setEmptyFields(json.emptyFields)

    }

    if (response.ok) {
      navigate("/")
      toast.success("Your work is safely saved!")
    } else {
      toast.error("Sorry, that save did not go so well, please try again")
    }
  }

  const saveIcon = <FontAwesomeIcon icon={faFloppyDisk} />

  return (
    <div className="edit">
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Edit Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={emptyFields.includes("title") ? "error" : ""}
          />
        </div>
        <div>

          <label htmlFor="body">Edit Body:</label>
          <textarea
            id="body"
            rows={3}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className={emptyFields.includes("body") ? "error" : ""}
          ></textarea>
        </div>
        <div>

          <label htmlFor="tags">Edit Tags:</label>
          <div className="input-tags-container">
            <ExperimentalAllTagsSelect onTagsChange={handleTagsChange} />
            <span className="document-tags">
              {tags.map((tag, index) => (
                <span key={index} className="tag-chip">
                  {tag}
                  <button onClick={() => deleteTag(index)}>X</button>
                </span>
              ))}
            </span>

          </div>
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

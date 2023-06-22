/* TODO 
1. Complete feature/chip_tags branch (user needs to apply labels to documents)-
1.1 Create functions to display chips after comma key pressed in tags field
1.2  Design a select / other component letting user choose pre-existing tags 
2. Research (& implement or reccomend) input validation, sanitisation
3. Create modal confirming user changes saved*/

import { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import CancelButton from "../components/CancelButton";

const Edit = ({ material }) => {
  const [title, setTitle] = useState(material.title)
  const [body, setBody] = useState(material.body)
  const [tags, setTags] = useState(material.tags)
  const { user } = useAuthContext()
  const navigate = useNavigate()

  useEffect(() => {
    setTitle(material.title)
    setBody(material.body)
    setTags(material.tags)
  }, [material])

  /* EXPERIMENT TO DELETE TAG FROM CURRENT STATE 
  const handleDeleteTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  }*/

  /* temporary auth to replace with SSO local storage insecure for user */
  const handleSubmit = async (e) => {
    e.preventDefault()
    const updatedMaterial = { title, body, tags }
    const response = await fetch(`/api/materials/${material._id}`, {
      method: "PATCH",
      headers:
      {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.token}`
      },
      body: JSON.stringify(updatedMaterial),
    });
    if (response.ok) {
      navigate("/")
    }
  }

  const deleteTag = (index) => {
    setTags(prevState => prevState.filter((tag, i) => i !== index))
  }

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
          />
        </div>
        <div>

          <label htmlFor="body">Edit Body:</label>
          <textarea
            id="body"
            rows={3}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          ></textarea>
        </div>
        <div>

          <label htmlFor="tags">Edit Tags:</label>
          <div className="input-tags-container">
            {tags.map((tag, index) => (
              
                 <span key={index} className="tag-chip">
                {tag}
                <button onClick={() => deleteTag(index)}>x</button>
              </span>

             
            ))}
            <input
              className="edit_tags"
              type="text"
              id="tags"
              value={tags.join(", ")}
              onChange={(e) => setTags(
                e.target.value.split(", ").map((tag) => tag.trim())
              )}
            />
          </div>
        </div>
        <div className="read_edit_create_btns">
          <CancelButton />
          <button className="save_btn" type="submit">Save</button>
        </div>
      </form>
    </div>
  )
}

export default Edit;

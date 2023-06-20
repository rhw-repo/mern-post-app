/* TODO 
1. Complete feature/chip_tags branch (user needs to apply labels to documents)-
1.1 Add spacing between displayed chip rows, review CSS field labels
1.2 Realign cancel button to right hand side of save button
1.3 Design a select / other component letting user choose pre-existing tags 
2. research (& implement or reccomend) input validation, sanitisation
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
              <span key={index} className="input-tags-chip tag-chip">
                {tag}
              </span>
            ))}
            <input
              className="edit_tags"
              type="text"
              id="tags"
              value={tags.join(", ")} // Convert the array back to a string for display
              onChange={(e) => setTags(e.target.value.split(", ").map((tag) => tag.trim()))}
            />
          </div>
        </div>
        <div className="read_edit_cancel_btns">
          <CancelButton />
        <button type="submit">Save</button>
        </div>
      </form>
    </div>
  )
}

export default Edit;

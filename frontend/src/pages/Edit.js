/* TODO 
1. Create a feature/chips branch (user needs to apply labels to their documents)
2. research (& implement or reccomend) input validation, sanitisation
3. create modal confirming user changes saved*/

import { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";

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
            rows={8}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          ></textarea>
        </div>
        <div>
          <label htmlFor="tags">Edit Tags:</label>
          { /* <input className="tags"
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />  */ }

          <div className="input-tags-container">
            {tags.map((tag, index) => (
              <span key={index} className="input-tags-chip">
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
          <button type="submit">Save</button>
      </form>
    </div>
  )
}

export default Edit;

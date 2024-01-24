import { useState, useEffect } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useMaterialsContext } from "../../hooks/useMaterialsContext";
import { useNavigate } from "react-router-dom";
import CancelButton from "../../components/CancelButton/CancelButton";
import toast from "react-hot-toast"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons"
import ExperimentalAllTagsSelect from "../../components/ExperimentalAllTagsSelect/ExperimentalAllTagsSelect"
import styles from "./Edit.module.css";

const Edit = ({ material }) => {
  // initialise state of title, content and tags
  const [title, setTitle] = useState(material.title)
  const [content, setContent] = useState(material.content)
  // error handling 
  const [error, setError] = useState(null)
  // keep track of any empty form fields 
  const [emptyFields, setEmptyFields] = useState([])

  // maintain state selected tags from drop-down options = other tags from user's doc collection
  const [selectedTags, setSelectedTags] = useState([]);
  // context hooks for global state management of user and materials
  const { dispatch } = useMaterialsContext()
  const { user } = useAuthContext()
  // navigation between routes 
  const navigate = useNavigate()
  // maintain  state for existing tags 
  const [tags, setTags] = useState(material.tags)
  // check - frontend validation prevents form submission with empty fields 
  const [isFormValid, setIsFormValid] = useState(false)
  const [trySubmit, setTrySubmit] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  console.log(emptyFields)
  // synchronise state when material prop updates 
  useEffect(() => {
    setTitle(material.title)
    setContent(material.content)
    setTags(material.tags)
  }, [material])

  // check if title, content & tags have user input 
  useEffect(() => {
    console.log('Title:', title);
    console.log('Content', content);
    console.log('Selected tags', selectedTags);
    if (title && content && (selectedTags.length > 0 || tags.length > 0)) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [title, content, selectedTags, tags.length]);

  // allow deletion of an existing tag based on it's index in Tags array
  const deleteTag = (index) => {
    setTags(prevState => prevState.filter((tag, i) => i !== index))
  }

  // update the state when tags selected from dropdown 
  const handleTagsChange = (newTags) => {
    setSelectedTags(newTags);
  }

  /* temporary auth to replace with SSO local storage insecure for user */
  const handleSubmit = async (e) => {
    e.preventDefault()

    // merge existing and new tags
    const everyTag = Array.from(new Set([...tags, ...selectedTags]))
    const updatedMaterial = { title, content, tags: everyTag }


    // Prevent form submission with empty fields 
    if (!isFormValid) {
      setTrySubmit(true);
      return;
    }

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
      // server-side error handling
      setError(json.error)
      setEmptyFields(json.emptyFields)
    }

    if (response.ok) {
      // update global state and navigate to homepage, 
      // show toast to confirm "work saved"
      setError(null)
      setEmptyFields([])
      dispatch({ type: "UPDATE_MATERIAL", payload: json })
      navigate("/")
      console.log("About to show success toast")
      toast.success("Your work is safely saved!")
    } else {
      toast.error("Sorry, that save did not go so well, please try again")
    }
  }

  // dynamic error message checks which fields are missing, 
  // stores in object, passes to error message to render 
  const missingFields = () => {
    let fields = []
    if (!title) fields.push("Title")
    if (!content) fields.push("Content")
    if (selectedTags.length === 0 && tags.length === 0) fields.push("Tags")
    return fields
  }

  const saveIcon = <FontAwesomeIcon icon={faFloppyDisk} />

  // Limit width of displayed tag 
  const trimText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "..."
    }
    return text
  }

  /* Prevent form submission on accidental double 
  "Enter" key down for ExperimentalAllTagsSelect */
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const type = document.activeElement.type
      if (isDropdownOpen || type === "submit" || type === "button") {
        return
      }
      e.preventDefault()
    }
  }

  return (
    <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
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

      <div>
        <label
          htmlFor="title"
          className="document-form-headings"
        >
          Edit Title:
        </label>
        <textarea
          id="title"
          rows={2}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={(trySubmit && !title) || emptyFields.includes("title") ? "error" : "primary"}
        />
      </div>

      <div>
        <label htmlFor="content" className="document-form-headings">Edit Content:</label>
        <textarea
          id="content"
          rows={8}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={(trySubmit && !content) || emptyFields.includes("content") ? "error" : "primary"}
        >
        </textarea>
      </div>

      <label htmlFor="tags" className={`${styles.editTagsSection} document-form-headings`}>Edit Tags:</label>
      <div className={styles.inputTagsContainer}>
        {tags.length > 0 && (
          <p className={styles.editTagsSection}>Tags you already have here - click on the x to delete any you don't want:</p>
        )}
        <div className={`${styles.editTagsSection} edit-document-tags`}>
          {tags.length > 0 && tags.map((tag, index) => (
            <span key={index} className={`${styles.editExistingTags} tag-chip`}>
              {trimText(tag, 16)}
              <button type="button" onClick={() => deleteTag(index)}>X</button>
            </span>
          ))}
        </div>
        {trySubmit && selectedTags.length === 0 && tags.length === 0 && (
          <div className="error">Please add some tags!</div>
        )}
        <div className={styles.editTagsSelect}>
          <ExperimentalAllTagsSelect
            onTagsChange={handleTagsChange}
            onMenuOpen={() => setIsDropdownOpen(true)}
            onMenuClose={() => setIsDropdownOpen(false)}
          />
        </div>
      </div>
      <div className="content-detail-edit-create-btns">
        <CancelButton />
        <button
          className={`${styles.saveBtn} save-btn`}
          type="submit"
        >
          {saveIcon} Save
        </button>
      </div>
    </form>
  )
}

export default Edit;

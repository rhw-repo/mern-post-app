import { useState, useEffect } from "react";
import Creatable from "react-select/creatable";
import { useMaterialsContext } from "../../hooks/useMaterialsContext";
import styles from "./ExperimentalAllTagsSelect.module.css";

function ExperimentalAllTagsSelect({ onTagsChange }) {
  console.log('ExperimentalAllTagsSelect rendered!');
  console.log('All props:', { onTagsChange });
  const { materials } = useMaterialsContext();
  const [selectedTags, setSelectedTags] = useState([])
  const [allTags, setAllTags] = useState([])
  const [loading, setLoading] = useState(true)
  const [dataLoaded, setDataLoaded] = useState(false)
  const [userInteracted, setUserInteracted] = useState(false);

  /* Added for debugging session. 
  Uncomment block to log the materials Prop every time it changes:
  useEffect(() => {
    console.log('materials prop changed:', materials);
  }, [materials]);*/

  // to load allTags from local storage on component mount
  useEffect(() => {
    const savedAllTags = JSON.parse(localStorage.getItem("allTags"))
    if (savedAllTags && savedAllTags.length > 0) {
      setAllTags(savedAllTags)
      setLoading(false)
      setDataLoaded(true)
    } else if (materials.length > 0) {
      const tagsSet = new Set(materials.flatMap((material) => material.tags))
      const tagsArray = Array.from(tagsSet)
      setAllTags(tagsArray)
      setLoading(false)
      localStorage.setItem("allTags", JSON.stringify(tagsArray))
      setDataLoaded(true)
    }
  }, [materials])

  useEffect(() => {
    console.log("allTags updated:", allTags)
  }, [allTags])

  // to handle onTagsChange whenever selectedTags changes
  useEffect(() => {
    if (userInteracted) {
      onTagsChange(selectedTags)
    }
  }, [selectedTags, onTagsChange, userInteracted])

  const handleChange = (selectedOptions) => {
    const options = selectedOptions
      ? Array.from(new Set(selectedOptions.map((option) => option.value)))
      : []
    setSelectedTags(options)
    setAllTags(prevTags => Array.from(new Set([...prevTags, ...options])))
    setUserInteracted(true)
  };

  // update allTags in localStorage to include any new tags created
  useEffect(() => {
    localStorage.setItem("allTags", JSON.stringify(allTags))
  }, [allTags])

  const isValidNewOption = (inputValue, selectValue, selectOptions) => {
    if (
      inputValue.trim().length === 0 ||
      // Prevent excessively long options affecting layout 
      inputValue.length > 16 ||
      allTags.find((option) => option.value === inputValue)
    ) {
      return false
    }
    return true
  }

  if (loading) {
    return <div>Loading...</div>
  }
  // error handling
  if (!dataLoaded) {
    return <div className="error">
      An error occured: please try refreshing the page.
      If this problem persists, please contact support.
    </div>
  }

  /* dynamic styling based on component state, replaces default styles */
  const customCreatableStyles = {
    control: (baseStyles, state) => ({
      ...baseStyles,
      cursor: "pointer",
      /* Select containers stay within container width */
      width: "100%",
      maxWidth: "100%",
      marginTop: "1rem",
      marginLeft: "auto",
      marginRight: "auto",
      border: state.isFocused ? '1px solid #667B99' : '1px solid #e6e6e6',
      boxShadow: state.isFocused ? '0 0 0 1px #667B99' : baseStyles.boxShadow,
      '&:hover': {
        border: state.isFocused ? '1px solid #667B99' : '1px solid #e6e6e6',
      }
    }),
    /* Horizontal space between options & scrollbar,
    limit height prevent overlaying navbar */
    menuList: (baseStyles, state) => ({
      ...baseStyles,
      padding: "0.5rem",
    }),
    /* Limit height prevent overlaying navbar */
    menu: (baseStyles, state) => ({
      ...baseStyles,
    }),
    placeholder: (baseStyles) => ({
      ...baseStyles,
      color: "var(--secondary)",
      fontSize: '1rem',
    }),
    option: (baseStyles, state) => ({
      ...baseStyles,
      maxWidth: "100%",
      padding: "1rem 0.5rem",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      backgroundColor: state.isFocused ? "var(--secondary-light)" : baseStyles.backgroundColor,
      color: state.isFocused ? 'white' : baseStyles.color,
      ':hover': {
        backgroundColor: "var(--secondary-light)",
      }
    }),
    multiValue: (baseStyles, state) => {
      return {
        ...baseStyles,
        backgroundColor: "var(--secondary-chips)",
        color: 'white',
        /*Limits width of displayed selected options */
        maxWidth: "100%",
        whiteSpace: "nowrap",
        /* Centers text within displayed selected options */
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 0.2rem",
        overflow: "hidden"
      }
    },
    multiValueLabel: (baseStyles, state) => {
      return {
        ...baseStyles,
        color: "#fffffff",
        fontSize: "1rem",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }
    },
    multiValueRemove: (baseStyles, state) => {
      return {
        ...baseStyles,
        color: "#fffffff",
        fontSize: "1rem",
        padding: "0.9rem",
      }
    },
    /* Limits height of container displaying 
    selected options to avoid affecting parent container height */
    /* maxWidth ensures they fill container widthways */
    valueContainer: (baseStyles, state) => {
      return {
        ...baseStyles,
        maxWidth: "100%",
        maxHeight: "7.375rem",
        overflowY: "auto",
        boxSizing: "border-box",
      }
    },
    dropdownIndicator: (baseStyles, state) => {
      return {
        ...baseStyles,
        color: "var(--secondary)",
        padding: "0.9rem",
      }
    },
    clearIndicator: (baseStyles, state) => {
      return {
        ...baseStyles,
        color: "var(--secondary)",
        padding: "0.9rem",
      }
    },
  }

  return (
    <label className={styles.tagSectionLabel}>
      Select or create tags:
      <div className={styles.selectContainer}>
        {allTags ? (
          <Creatable
            className={styles.creatableSelect}
            isMulti
            options={allTags.map((tag) => ({
              value: tag,
              label: tag,
            }))}
            value={selectedTags.map((tag) => ({ value: tag, label: tag }))}
            onChange={handleChange}
            isValidNewOption={isValidNewOption}
            styles={customCreatableStyles}
            menuPlacement="top"  
          />
        ) : (
          <div>No tags available</div>
        )}
      </div>
    </label>
  )
}

export default ExperimentalAllTagsSelect;

import { useState, useEffect } from "react";
import Creatable from "react-select/creatable";
import { useMaterialsContext } from "../../hooks/useMaterialsContext";
import styles from "./ExperimentalAllTagsSelect.module.css";

function ExperimentalAllTagsSelect({ onTagsChange }) {
  const { materials } = useMaterialsContext();
  const [selectedTags, setSelectedTags] = useState([])
  const [allTags, setAllTags] = useState([])
  const [loading, setLoading] = useState(true)
  const [dataLoaded, setDataLoaded] = useState(false)

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
    onTagsChange(selectedTags);
  }, [selectedTags, onTagsChange]);

  const handleChange = (selectedOptions) => {
    const options = selectedOptions
      ? Array.from(new Set(selectedOptions.map((option) => option.value)))
      : []
    setSelectedTags(options)
    setAllTags(prevTags => Array.from(new Set([...prevTags, ...options])))
  };

  // update allTags in localStorage to include any new tags created
  useEffect(() => {
    localStorage.setItem("allTags", JSON.stringify(allTags))
  }, [allTags])

  const isValidNewOption = (inputValue, selectValue, selectOptions) => {
    if (
      inputValue.trim().length === 0 ||
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
      border: state.isFocused ? '1px solid #667B99' : '1px solid #e6e6e6',
      boxShadow: state.isFocused ? '0 0 0 1px #667B99' : baseStyles.boxShadow,
      '&:hover': {
        border: state.isFocused ? '1px solid #667B99' : '1px solid #e6e6e6',
      }
    }),
    placeholder: (baseStyles) => ({
      ...baseStyles,
      color: '#435362',
      fontSize: '1rem', 
  }),
    option: (baseStyles, state) => ({
      ...baseStyles,
      backgroundColor: state.isFocused ? '#667B99' : baseStyles.backgroundColor,
      color: state.isFocused ? 'white' : baseStyles.color,
      ':hover': {
        backgroundColor: '#667B99',
        color: 'white',
      }
    }), multiValue: (baseStyles, state) => {
      return {
        ...baseStyles,
        backgroundColor: '#667B99',
        color: 'white',
      }
    },
    multiValueLabel: (baseStyles, state) => {
      return {
        ...baseStyles,
        color: 'white',
      }
    }
  }

  return (
    <label>
      Click the arrow to select or create tags:
      <div className={styles.selectContainer}>
        {allTags ? (
          <Creatable
            isMulti
            options={allTags.map((tag) => ({
              value: tag,
              label: tag,
            }))}
            value={selectedTags.map((tag) => ({ value: tag, label: tag }))}
            onChange={handleChange}
            isValidNewOption={isValidNewOption}
            styles={customCreatableStyles}
          />
        ) : (
          <div>No tags available</div>
        )}
      </div>
    </label>
  )
}

export default ExperimentalAllTagsSelect;

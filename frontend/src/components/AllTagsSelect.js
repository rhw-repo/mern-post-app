/* TODO REDUNDANT REPLACE WITHOUT USING USECONTEXT ALLTAGSCONTEXT 

1.1 debug form cancels on multiple presses enter if creating new tags
1.2 debug prevent dupes in 'tags' and allTags options list
1.3 debug persist state on page refresh to load options again
1.4 style border color, tags color, highlight bar color 
2. Remove use of context file for allTags
import { useContext, useState, useEffect } from "react";
import { AllTagsContext } from "../context/AllTagsContext";
import Creatable from "react-select/creatable";

// flat() converts nested array into single level array
function AllTagsSelect({ onTagsChange }) {
  const { allTags } = useContext(AllTagsContext);
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (allTags) {
      const flattenedTags = Array.from(new Set(allTags.flat()))
      setSelectedTags((prevSelectedTags) => {
        const newSelectedTags = prevSelectedTags.filter((tag) =>
          flattenedTags.includes(tag)
        );
        return newSelectedTags
      });
      setLoading(false)
    } else {
      setLoading(true)
    }
  }, [allTags, loading])
  
  const handleChange = (selectedOptions) => {
    const options = selectedOptions
      ? Array.from(new Set(selectedOptions.map((option) => option.value)))
      : []
    setSelectedTags(options)
    onTagsChange(options)
  }
  
  const isValidNewOption = (inputValue, selectValue, selectOptions) => {
    if (
      inputValue.trim().length === 0 ||
      selectOptions.find(option => option.value === inputValue)
    ) {
      return false
    }
    return true
  }

  return (
    <label>
      Click on tags or type in new tags:
      <div className="select-container">
        {loading ? (
          <div>Loading...</div>
        ) : allTags ? (
          <Creatable
            isMulti
            options={allTags.flat().map((tag) => ({
              value: tag,
              label: tag,
            }))}
            value={selectedTags.map((tag) => ({ value: tag, label: tag }))}
            onChange={handleChange}
            isValidNewOption={isValidNewOption}
          />
        ) : (
          <div>No tags available</div>
        )}
      </div>
    </label>
  )
}

export default AllTagsSelect;*/

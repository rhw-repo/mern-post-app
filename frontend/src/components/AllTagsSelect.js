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
      const flattenedTags = allTags.flat(); 
      setSelectedTags((prevSelectedTags) => {
        const newSelectedTags = prevSelectedTags.filter((tag) =>
          flattenedTags.includes(tag)
        )
        return newSelectedTags
      })
      setLoading(false)
    } else {
      setLoading(true)
    }
  }, [allTags, loading])

  const handleChange = (selectedOptions) => {
    const options = selectedOptions ? selectedOptions.map((option) => option.value) : []
    setSelectedTags(options)
    onTagsChange(options)
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
          />
        ) : (
          <div>No tags available</div>
        )}
      </div>
    </label>
  )
}

export default AllTagsSelect;

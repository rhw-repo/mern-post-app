import { useContext, useState } from "react";
import { AllTagsContext } from "../context/AllTagsContext";

// TempSelect.js
function TempSelect({ onTagsChange }) {
    const { allTags } = useContext(AllTagsContext)
    const [selectedTags, setSelectedTags] = useState([])

    console.log("allTags:", allTags)

    const handleChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
        setSelectedTags(selectedOptions)
        if (onTagsChange) {
            onTagsChange(selectedOptions)
        }
    }

    const flattenedTags = allTags.flat()

      // Check if allTags is empty
  if (allTags.length === 0) {
    return <div>Loading...</div>;
  }

    return (
        <label>
            Click on tags:
            <select multiple={true} value={selectedTags} onChange={handleChange}>
                {flattenedTags.map((tag, index) => (
                    <option key={index} value={tag}>
                        {tag}
                    </option>
                ))}
            </select>
        </label>
    )
}

export default TempSelect
import { useContext, useState } from "react";
import { AllTagsContext } from "../context/AllTagsContext";

// TempSelect.js
function TempSelect({ onTagsChange }) {
    const { allTags } = useContext(AllTagsContext)
    const [selectedTags, setSelectedTags] = useState([])

    const handleChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
        setSelectedTags(selectedOptions)
        if (onTagsChange) {
            onTagsChange(selectedOptions)
        }
    }

    return (
        <label>
            Pick tags:
            <select multiple={true} value={selectedTags} onChange={handleChange}>
                {allTags.map((tag, index) => (
                    <option key={index} value={tag}>
                        {tag}
                    </option>
                ))}
            </select>
        </label>
    )
}

export default TempSelect

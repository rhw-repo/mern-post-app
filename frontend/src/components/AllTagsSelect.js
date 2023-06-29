import { useContext, useState } from "react";
import { AllTagsContext } from "../context/AllTagsContext";

function AllTagsSelect({ onTagsChange }) {
    const { allTags } = useContext(AllTagsContext)
    const [selectedTags, setSelectedTags] = useState([])

    console.log("allTags:", allTags)

    /*const handleChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
        setSelectedTags(selectedOptions)
        if (onTagsChange) {
            onTagsChange(selectedOptions)
        }
    }*/
    const handleChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value)

        setSelectedTags(prevSelectedTags => {
            const newSelectedTags = [...prevSelectedTags]

            // Add newly selected options.
            for (const option of selectedOptions) {
                if (!newSelectedTags.includes(option)) {
                    newSelectedTags.push(option)
                }

                console.log(newSelectedTags);
                setSelectedTags(newSelectedTags);
            }

            // Remove deselected options.
            for (const tag of newSelectedTags) {
                if (!selectedOptions.includes(tag)) {
                    newSelectedTags.splice(newSelectedTags.indexOf(tag), 1)
                }
            }

            if (onTagsChange) {
                onTagsChange(newSelectedTags)
            }

            return newSelectedTags
        })
    }

    const flattenedTags = allTags.flat()

    // Checks if allTags is empty
    if (allTags.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <label>
            Click on tags:
            <div className="select-container">
                <select className="all-tags-select"
                    multiple={true} value={selectedTags} onChange={handleChange}>
                    {flattenedTags.map((tag, index) => (
                        <option key={index} value={tag}>
                            {tag}
                        </option>
                    ))}
                </select>
            </div>
        </label>
    )
}

export default AllTagsSelect
import { useContext, useState, useEffect } from "react"
import { AllTagsContext } from "../context/AllTagsContext"

function AllTagsSelect({ onTagsChange }) {
  const { allTags } = useContext(AllTagsContext)
  const [selectedTags, setSelectedTags] = useState([])

  const handleChange = (e) => {
    const options = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedTags(options);
    onTagsChange(options);
  }
  

  useEffect(() => {
    if (allTags) {
      setSelectedTags((prevSelectedTags) => {
        const newSelectedTags = prevSelectedTags.filter((tag) => allTags.flat().includes(tag))
        return newSelectedTags;
      });
    }
  }, [allTags]);

  //const flattenedTags = allTags ? allTags.flat() : []
  const flattenedTags = allTags ? Array.from(new Set(allTags.flat())) : [];

  return (
    <label>
      Click on tags:
      <div className="select-container">
        {flattenedTags.length > 0 ? (
         <select className="all-tags-select" multiple={true} value={selectedTags} onChange={handleChange}>
         
         {flattenedTags.map((tag) => (
           <option key={tag} value={tag}>
             {tag}
           </option>
           
         ))}
       </select>
       
        ) : (
          <div>No tags available</div>
        )}
      </div>
    </label>
  )
}

export default AllTagsSelect;

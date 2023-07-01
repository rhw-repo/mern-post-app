// TODO 1. check join removing commas and debug 
import { useContext, useState, useEffect } from "react";
import { AllTagsContext } from "../context/AllTagsContext";
import Select from "react-select";

function AllTagsSelect({ onTagsChange }) {
  const { allTags } = useContext(AllTagsContext)
  const [selectedTags, setSelectedTags] = useState([])
  const [loading, setLoading] = useState(true)

  console.log("Type of allTags: ", typeof allTags)
  console.log("Is allTags an array? ", Array.isArray(allTags))
  console.log("On render, allTags is " + allTags)

// HTML select, abandoned 
 /* const handleChange = (e) => {
    const options = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedTags(options);
    onTagsChange(options);
  } */

  const handleChange = (selectedOptions) => {
    const options = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setSelectedTags(options)
    onTagsChange(options)
  }
  

 useEffect(() => {
    if (allTags) {
      setSelectedTags((prevSelectedTags) => {
        const newSelectedTags = prevSelectedTags.filter((tag) => allTags.includes(tag))
        return newSelectedTags
      })
      setLoading(false)
    }
  }, [allTags])
 
  //const flattenedTags = allTags ? allTags.flat() : []
 // const flattenedTags = allTags ? Array.from(new Set(allTags.flat())) : [];
 const flattenedTags = allTags || []

 console.log("Selected Tags is " + selectedTags)
// html select abandoned 
  /*  { /* <select className="all-tags-select" multiple={true} value={selectedTags} onChange={handleChange}> } */


 if (!Array.isArray(allTags)) {
  throw new Error('allTags must be an array')
}

const allTagsArray = flattenedTags.join("")
console.log(allTagsArray)


const options = allTagsArray.map(tag => {
  if (typeof tag !== 'string') {
    throw new Error('allTags must contain only strings');
  }
  return { value: tag, label: tag }
})


  console.log("allTags is " + allTags)
 console.log("options is " + options)
  return (
    <label>
      Click on tags:
      <div className="select-container">
        {loading ? (
          <div>Loading...</div>
        ) : flattenedTags.length > 0 ? (
          <Select
            isMulti
            options={options}
            value={selectedTags.map(tag => ({ label: tag, value: tag }))}
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

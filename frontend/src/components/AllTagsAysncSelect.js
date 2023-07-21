// need: clarity and a filter function for table rows
// data passed following async fetch() call in Home.js 
import AsyncSelect from "react-select/async"

// data passed from parent Table.js,  need to destructure all document tags 
const AllTagsAsyncSelect = ({ data }) => {
   console.log("This is data onload for AllTagsAsyncSelect")
   console.log({ data })
   const loadOptions = (inputValue, callback) => {
      // flatMap() maps all array elements & creates new flat array
      // flatten all tags arrays into a single array
      const allTags = data.flatMap(item => item.tags)
      // Remove duplicates (values can only occur once in a Set) 
      const uniqueTags = [...new Set(allTags)]

      const options = uniqueTags
      // filter for tags that include inputValue as substring
         .filter(tag => tag.toLowerCase().includes(inputValue.toLowerCase()))
         .map(tag => ({
            value: tag,
            label: tag,
         }))
// simulation of async - prevent no options loading? replace with skeleton loading ? 
// confused here - need clarity on this and defaultOptions 
      setTimeout(() => {
         callback(options)
      }, 1000)
   }

   return (
      <>
         <AsyncSelect
            isMulti
            loadOptions={loadOptions}
            cacheOptions
            defaultOptions

         />
      </>
   )
}

export default AllTagsAsyncSelect
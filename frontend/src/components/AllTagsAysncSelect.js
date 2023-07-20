import AsyncSelect from "react-select/async"

// data passed from parent Table.js,  need to destructure all document tags 
const AllTagsAsyncSelect = ({ data }) => {
   console.log("This is data onload for AllTagsAsyncSelect")
   console.log({ data })
   const loadOptions = (inputValue, callback) => {
      // flatMap() maps all array elements & creates new flat array
      // flatten all tags arrays into a single array
      const allTags = data.flatMap(item => item.tags)
      // Remove duplicates
      const uniqueTags = [...new Set(allTags)]

      const options = uniqueTags
         .filter(tag => tag.toLowerCase().includes(inputValue.toLowerCase()))
         .map(tag => ({
            value: tag,
            label: tag,
         }))
// simulation of async - prevent no options loading? replace with skeleton loading ? 
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
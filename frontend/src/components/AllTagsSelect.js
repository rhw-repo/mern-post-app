import { useContext, useState, useEffect } from "react";
import { AllTagsContext } from "../context/AllTagsContext";
import Select from "react-select";

function AllTagsSelect({ onTagsChange }) {
  const { allTags } = useContext(AllTagsContext);
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (allTags) {
      const flattenedTags = allTags.flat(); // Flatten the nested array structure
      setSelectedTags((prevSelectedTags) => {
        const newSelectedTags = prevSelectedTags.filter((tag) =>
          flattenedTags.includes(tag)
        );
        return newSelectedTags;
      });
      setLoading(false);
    }
  }, [allTags]);

  const handleChange = (selectedOptions) => {
    const options = selectedOptions ? selectedOptions.map((option) => option.value) : [];
    setSelectedTags(options);
    onTagsChange(options);
  };

  return (
    <label>
      Click on tags:
      <div className="select-container">
        {loading ? (
          <div>Loading...</div>
        ) : allTags ? (
          <Select
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
  );
}

export default AllTagsSelect;

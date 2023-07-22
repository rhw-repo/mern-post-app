import { useState, useEffect } from "react";
import Creatable from "react-select/creatable";
import { useMaterialsContext } from "../hooks/useMaterialsContext";

function ExperimentalAllTagsSelect({ onTagsChange }) {
  const { materials } = useMaterialsContext();
  const [selectedTags, setSelectedTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Effect to load allTags from local storage on component mount
  useEffect(() => {
    const savedAllTags = JSON.parse(localStorage.getItem("allTags"));
    if (savedAllTags && savedAllTags.length > 0) {
      setAllTags(savedAllTags);
      setLoading(false);
      setDataLoaded(true);
    } else if (materials !== null) {
      const tagsSet = new Set(materials.flatMap((material) => material.tags));
      const tagsArray = Array.from(tagsSet);
      setAllTags(tagsArray);
      setLoading(false);
      localStorage.setItem("allTags", JSON.stringify(tagsArray));
      setDataLoaded(true);
    }
  }, [materials]);

  // Effect to handle onTagsChange whenever selectedTags changes
  useEffect(() => {
    onTagsChange(selectedTags);
  }, [selectedTags, onTagsChange]);

  const handleChange = (selectedOptions) => {
    const options = selectedOptions
      ? Array.from(new Set(selectedOptions.map((option) => option.value)))
      : [];
    setSelectedTags(options);
  };

  const isValidNewOption = (inputValue, selectValue, selectOptions) => {
    if (
      inputValue.trim().length === 0 ||
      selectOptions.find((option) => option.value === inputValue)
    ) {
      return false;
    }
    return true;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!dataLoaded) {
    return null; // You can choose to return a loading spinner or message here
  }

  return (
    <label>
      Click on tags or type in new tags:
      <div className="select-container">
        {allTags ? (
          <Creatable
            isMulti
            options={allTags.map((tag) => ({
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
  );
}

export default ExperimentalAllTagsSelect;

import React, { useState, useEffect } from "react";
import { fetchAllTags } from "../api/apiServices";

const TagDropdown = ({ onTagSelect }) => {
  const [tags, setTags] = useState([]);
  const [selectedTagIds, setSelectedTagIds] = useState([]);

  useEffect(() => {
    // Fetch tags from an API or hardcode them
    const fetchTags = async () => {
      // Simulate fetch
      const token = localStorage.getItem("accessToken").toString(); // Replace this with how you manage tokens
      const response = await fetchAllTags(token);
      setTags(response);
    };

    fetchTags();
  }, []);

  const handleTagChange = (e) => {
    const selectedIds = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSelectedTagIds(selectedIds);
    onTagSelect(selectedIds); // Pass selected IDs to parent component
  };

  return (
    <select multiple={true} onChange={handleTagChange}>
      {tags.map((tag) => (
        <option key={tag._id} value={tag._id}>
          {tag.name}
        </option>
      ))}
    </select>
  );
};

export default TagDropdown;

import React, { useState } from "react";
import "./EditResourceModal.css"; // Adjust the path as needed

const EditResourceModal = ({ resource, onSave, onClose }) => {
  const [tags, setTags] = useState(resource.tags || []);
  const [category, setCategory] = useState(resource.category || "");
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("tags", JSON.stringify(tags));
    formData.append("category", category);
    if (file) {
      formData.append("file", file);
    }

    // Trigger the save function to handle the API call
    onSave(resource._id, formData);
  };

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h2>Edit Resource</h2>

        <div>
          <label>Tags:</label>
          <input
            type="text"
            value={tags.join(", ")}
            onChange={(e) => setTags(e.target.value.split(","))}
            placeholder="Enter tags separated by commas"
          />
        </div>

        <div>
          <label>Category:</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <div>
          <label>Replace File:</label>
          <input type="file" onChange={handleFileChange} />
        </div>

        <button onClick={handleSubmit}>Save Changes</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default EditResourceModal;

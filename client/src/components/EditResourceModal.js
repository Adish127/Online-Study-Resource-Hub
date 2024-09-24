import React, { useState } from "react";
import "./EditResourceModal.css"; // Add some styles if needed

const EditResourceModal = ({ resource, onClose, onSave }) => {
  const [title, setTitle] = useState(resource.title);
  const [category, setCategory] = useState(resource.category);

  const handleSave = () => {
    // Create an updated resource object with the new values
    const updatedResource = {
      ...resource,
      title,
      category,
    };

    // Call onSave with the updated resource object
    onSave(updatedResource);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Edit Resource</h3>

        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Category:</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <div className="modal-actions">
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditResourceModal;

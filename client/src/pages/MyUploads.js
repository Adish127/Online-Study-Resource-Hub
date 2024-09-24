import React, { useState, useEffect, useRef } from "react";
import { fetchUserResources, deleteResource } from "../api/apiServices"; // Import the necessary API functions
import { useNavigate } from "react-router-dom";
import * as pdfjsLib from "pdfjs-dist/webpack";
import "./MyUploads.css";
import { FaTrash, FaEdit } from "react-icons/fa"; // Import icons

const MyUploads = () => {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const canvasRefs = useRef([]);

  // Get the user's authentication token
  const token = localStorage.getItem("accessToken");

  // Fetch user's uploaded resources
  const loadResources = async () => {
    try {
      const fetchedResources = await fetchUserResources(token);
      setResources(fetchedResources);
      setLoading(false);
    } catch (err) {
      setError("Failed to load resources.");
      setLoading(false);
    }
  };

  // Delete a resource
  const handleDelete = async (resourceId) => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      try {
        await deleteResource(token, resourceId);
        setResources(
          resources.filter((resource) => resource._id !== resourceId)
        );
      } catch (err) {
        setError("Failed to delete resource.");
      }
    }
  };

  // UseEffect to load resources on component mount
  useEffect(() => {
    loadResources();
  }, [token]);

  if (loading) return <div>Loading resources...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="my-resources-container">
      <h2>My Resources</h2>
      <div className="view-toggle">
        <button
          className={viewMode === "grid" ? "active" : ""}
          onClick={() => setViewMode("grid")}
        >
          Grid View
        </button>
        <button
          className={viewMode === "list" ? "active" : ""}
          onClick={() => setViewMode("list")}
        >
          List View
        </button>
      </div>
      <div className={`resources-view ${viewMode}`}>
        {resources.map((resource, index) => (
          <div key={resource._id} className="resource-card">
            <div className="resource-thumbnail">
              {resource.fileUrl.endsWith(".pdf") ? (
                <canvas ref={(el) => (canvasRefs.current[index] = el)}></canvas>
              ) : (
                <img src={resource.fileUrl} alt={resource.fileName} />
              )}
            </div>
            <div className="resource-details">
              <h4>{resource.fileName}</h4>
              <p>{resource.description}</p>
              <div className="resource-actions">
                <FaEdit
                  className="edit-icon"
                  onClick={() => navigate(`/resources/edit/${resource._id}`)}
                  title="Edit Resource"
                />
                <FaTrash
                  className="delete-icon"
                  onClick={() => handleDelete(resource._id)}
                  title="Delete Resource"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyUploads;

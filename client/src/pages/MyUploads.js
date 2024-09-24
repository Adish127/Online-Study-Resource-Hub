import React, { useState, useEffect, useRef } from "react";
import {
  fetchUserResources,
  deleteResource,
  editResource,
} from "../api/apiServices"; // Import your API services
import { useNavigate } from "react-router-dom";
import * as pdfjsLib from "pdfjs-dist/webpack"; // For rendering PDF previews
import "./MyUploads.css"; // Custom styles
import { FaTrash, FaEdit } from "react-icons/fa"; // Import icons for editing and deleting
import EditResourceModal from "../components/EditResourceModal"; // Import the modal component for editing

const MyUploads = () => {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]); // Holds the user's uploaded resources
  const [viewMode, setViewMode] = useState("grid"); // Toggle between grid and list view
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const canvasRefs = useRef([]); // Holds references for canvas elements for PDF previews
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls whether the edit modal is open
  const [editingResource, setEditingResource] = useState(null); // Stores the resource being edited

  // Get the user's authentication token from localStorage
  const token = localStorage.getItem("accessToken");

  // Function to fetch the user's uploaded resources
  const loadResources = async () => {
    try {
      const fetchedResources = await fetchUserResources(token); // Fetch resources using API
      setResources(fetchedResources);
      setLoading(false); // Stop loading once resources are fetched
    } catch (err) {
      setError("Failed to load resources.");
      setLoading(false); // Stop loading even if there is an error
    }
  };

  // Function to delete a resource
  const handleDelete = async (resourceId) => {
    if (!token) {
      setError("Unauthorized. Please log in again.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this resource?")) {
      try {
        setLoading(true);
        await deleteResource(token, resourceId); // Delete the resource using API
        setResources(
          resources.filter((resource) => resource._id !== resourceId)
        ); // Remove the resource from state
        setLoading(false);
      } catch (err) {
        setError("Failed to delete resource. Please try again.");
        setLoading(false);
      }
    }
  };

  // Function to render a PDF preview using pdfjsLib
  const renderPDF = (fileUrl, index) => {
    const loadingTask = pdfjsLib.getDocument(fileUrl);
    loadingTask.promise.then(
      (pdf) => {
        pdf.getPage(1).then((page) => {
          const scale = 1.5;
          const viewport = page.getViewport({ scale });
          const canvas = canvasRefs.current[index];
          const context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };
          page.render(renderContext);
        });
      },
      (reason) => {
        console.error(reason);
      }
    );
  };

  useEffect(() => {
    loadResources(); // Fetch resources when the component mounts
  }, [token]);

  useEffect(() => {
    // Render PDF preview for each resource
    resources.forEach((resource, index) => {
      if (resource.fileUrl.endsWith(".pdf")) {
        renderPDF(resource.fileUrl, index);
      }
    });
  }, [resources]);

  // Navigate to the resource upload page
  const handleUploadResource = () => {
    navigate("/resources/upload", { replace: true });
  };

  // Function to open the modal for editing a resource
  const handleEdit = (resource) => {
    setEditingResource(resource);
    setIsModalOpen(true);
  };

  // Function to save the edited resource
  const handleSaveEdit = async (resourceId, updatedResourceData) => {
    try {
      setLoading(true);

      // Prepare formData to send the file and updated data
      const formData = new FormData();
      if (updatedResourceData.file) {
        formData.append("file", updatedResourceData.file); // Append the new file if it exists
      }
      formData.append("tags", JSON.stringify(updatedResourceData.tags)); // Append the updated tags
      formData.append("category", updatedResourceData.category); // Append the updated category

      await editResource(token, resourceId, formData); // Call the API to edit the resource

      const updatedResources = await fetchUserResources(token); // Fetch the updated resources
      setResources(updatedResources); // Update the resources in state

      setIsModalOpen(false); // Close the modal after saving
      setLoading(false);
    } catch (error) {
      setError("Failed to save changes. Please try again.");
      setLoading(false);
    }
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle loading and error states
  if (loading) return <div>Loading resources...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="my-resources-container">
      <h2>My Resources</h2>
      <button className="upload-resource-btn" onClick={handleUploadResource}>
        Upload Resource
      </button>

      {/* Toggle between grid and list views */}
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

      {/* Render the user's resources */}
      <div className={`resources-view ${viewMode}`}>
        {resources.map((resource, index) => (
          <div key={resource._id} className="resource-card">
            <div className="resource-thumbnail">
              {resource.fileUrl.endsWith(".pdf") ? (
                <div className="pdf-preview">
                  <canvas ref={(el) => (canvasRefs.current[index] = el)} />
                </div>
              ) : (
                <img src={resource.fileUrl} alt={resource.fileName} />
              )}
            </div>
            <div className="resource-details">
              <h4>{resource.fileName}</h4>
              <p>{resource.description}</p>

              {/* Edit and Delete buttons */}
              <div className="resource-actions">
                <FaEdit
                  className="edit-icon"
                  onClick={() => handleEdit(resource)}
                  title="Edit Resource"
                />
                <FaTrash
                  className="delete-icon"
                  onClick={() => handleDelete(resource._id)}
                  title="Delete Resource"
                />
              </div>

              <button
                className="open-resource-btn"
                onClick={() => window.open(resource.fileUrl, "_blank")}
              >
                Open Resource
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Conditionally render the EditResourceModal */}
      {isModalOpen && (
        <EditResourceModal
          resource={editingResource}
          onClose={closeModal}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
};

export default MyUploads;

import React, { useState, useEffect, useRef } from "react";
import {
  browseResources,
  fetchUserResources,
  fetchAllTags,
} from "./api/apiServices";
import * as pdfjsLib from "pdfjs-dist/webpack";
import { useNavigate } from "react-router-dom";
import "./Resources.css";

const Resources = () => {
  const [resources, setResources] = useState([]); // Stores all resources
  const [filteredResources, setFilteredResources] = useState([]); // Stores resources after filtering
  const [userResources, setUserResources] = useState([]); // User's personal resources
  const [tags, setTags] = useState([]); // For storing tags from the database
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMyResources, setShowMyResources] = useState(false); // For displaying user resources pop-up

  const token = localStorage.getItem("accessToken");
  const canvasRefs = useRef([]); // Array to hold refs for each resource's canvas
  const navigate = useNavigate(); // Use navigate from react-router-dom

  // State for search and filters
  const [query, setQuery] = useState(""); // Search query
  const [category, setCategory] = useState(""); // Filter by category (tag)
  const [accessLevel] = useState("public"); // Filter only by public access level

  // Fetch tags (categories) from the API
  useEffect(() => {
    const loadTags = async () => {
      try {
        const tagsData = await fetchAllTags(token);
        setTags(tagsData);
      } catch (err) {
        console.error("Failed to load tags", err);
      }
    };

    loadTags();
  }, [token]);

  // Fetch public resources initially (browse mode)
  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        const data = await browseResources(token, { accessLevel: "public" });
        setResources(data);
        setFilteredResources(data); // Set initial filtered data to all resources
        setLoading(false);

        // Render PDF thumbnails immediately after fetching
        data.forEach((resource, index) => {
          if (resource.fileUrl.endsWith(".pdf")) {
            renderPDF(resource.fileUrl, index);
          }
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load resources.");
        setLoading(false);
      }
    };

    fetchResources();
  }, [token]);

  // Fetch user's personal resources when "View My Resources" is checked
  const fetchMyResources = async () => {
    setLoading(true);
    try {
      const data = await fetchUserResources(token);
      setUserResources(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load user resources.");
      setLoading(false);
    }
  };

  // Filter resources locally whenever query or category changes
  useEffect(() => {
    const filterResourcesLocally = () => {
      let updatedResources = resources;

      if (query) {
        updatedResources = updatedResources.filter((resource) =>
          resource.fileName.toLowerCase().includes(query.toLowerCase())
        );
      }

      if (category) {
        updatedResources = updatedResources.filter((resource) =>
          resource.tags.includes(category)
        );
      }

      setFilteredResources(updatedResources); // Update filtered resources
    };

    filterResourcesLocally();
  }, [query, category, resources]);

  // Handle pop-up for "My Resources"
  const handleMyResourcesChange = (e) => {
    const isChecked = e.target.checked;
    setShowMyResources(isChecked);
    if (isChecked) {
      fetchMyResources();
    }
  };

  // Render PDF thumbnail
  const renderPDF = async (fileUrl, index) => {
    const loadingTask = pdfjsLib.getDocument(fileUrl);
    try {
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);
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

      // Wait for the render to complete
      await page.render(renderContext).promise;
      console.log("Page rendered");
    } catch (reason) {
      console.error("Error rendering PDF:", reason);
    }
  };

  useEffect(() => {
    resources.forEach((resource, index) => {
      if (resource.fileUrl.endsWith(".pdf")) {
        renderPDF(resource.fileUrl, index);
      }
    });
  }, [resources]);

  // Render user resources when the modal is open
  const renderUserResources = () => {
    return (
      <>
        <div className="modal-backdrop"></div>
        <div className="my-resources-modal">
          <div className="modal-content">
            <button
              className="close-modal"
              onClick={() => setShowMyResources(false)}
            >
              Close
            </button>
            <h2>My Resources</h2>
            <div className={`resources-view grid`}>
              {userResources.length > 0 ? (
                userResources.map((resource, index) => (
                  <div
                    key={resource._id}
                    className="resource-card"
                    onClick={() =>
                      navigate(`/resources/view/${resource._id}`, {
                        replace: true,
                      })
                    } // Navigate to viewResources on card click
                  >
                    <div className="resource-thumbnail">
                      {resource.fileUrl.endsWith(".pdf") ? (
                        <div className="pdf-preview">
                          <canvas
                            ref={(el) => (canvasRefs.current[index] = el)}
                          ></canvas>
                        </div>
                      ) : (
                        <div>
                          <img src={resource.fileUrl} alt={resource.fileName} />
                        </div>
                      )}
                    </div>
                    <div className="resource-details">
                      <h4>{resource.fileName}</h4>
                      <p>{resource.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div>No resources found</div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  };

  if (loading) return <div>Loading resources...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="resources-container">
      <h2>Browse Resources</h2>

      {/* Checkbox for "View My Resources" */}
      <div className="view-my-resources">
        <label>
          <input
            type="checkbox"
            checked={showMyResources}
            onChange={handleMyResourcesChange}
          />
          View My Resources
        </label>
      </div>

      {/* Search and Filter Bars */}
      <div className="search-filter-container">
        <input
          type="text"
          placeholder="Search by keyword"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-bar"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="filter-bar"
        >
          <option value="">All Categories</option>
          {tags.map((tag) => (
            <option key={tag._id} value={tag._id}>
              {tag.name}
            </option>
          ))}
        </select>
      </div>

      {/* Display Resources */}
      <div className={`resources-view grid`}>
        {filteredResources.length > 0 ? (
          filteredResources.map((resource, index) => (
            <div
              key={resource._id}
              className="resource-card"
              onClick={() => navigate(`/resources/view/${resource._id}`)} // Navigate to viewResources on card click
            >
              <div className="resource-thumbnail">
                {resource.fileUrl.endsWith(".pdf") ? (
                  <div className="pdf-preview">
                    <canvas
                      ref={(el) => (canvasRefs.current[index] = el)}
                    ></canvas>
                  </div>
                ) : (
                  <div>
                    <img src={resource.fileUrl} alt={resource.fileName} />
                  </div>
                )}
              </div>
              <div className="resource-details">
                <h4>{resource.fileName}</h4>
                <p>{resource.description}</p>
              </div>
            </div>
          ))
        ) : (
          <div>No resources found</div>
        )}
      </div>

      {/* Render user resources in a modal if checkbox is checked */}
      {showMyResources && renderUserResources()}
    </div>
  );
};

export default Resources;

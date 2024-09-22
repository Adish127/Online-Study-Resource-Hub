import React, { useState, useEffect } from "react";
import { browseResources, fetchAllTags } from "./api/apiServices";
import "./BrowseResources.css";

const BrowseResources = () => {
  const [resources, setResources] = useState([]); // Stores all resources
  const [filteredResources, setFilteredResources] = useState([]); // Stores resources after filtering
  const [tags, setTags] = useState([]); // For storing tags from the database
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("accessToken");

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
  }, []);

  // Fetch all resources initially
  useEffect(() => {
    const fetchAllResources = async () => {
      setLoading(true);
      try {
        const data = await browseResources(token, { accessLevel: "public" }); // Fetch only public resources
        setResources(data);
        setFilteredResources(data); // Set initial filtered data to all resources
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load resources.");
        setLoading(false);
      }
    };

    fetchAllResources();
  }, []);

  // Filter resources locally whenever query or category changes
  useEffect(() => {
    const filterResourcesLocally = () => {
      // Perform search and category filtering
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

  // Handle search input change
  const handleSearchChange = (e) => {
    setQuery(e.target.value);
  };

  // Handle category (tag) change
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  if (loading) return <div>Loading resources...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="browse-resources-container">
      <h2>Browse Resources</h2>

      {/* Search and Filter Bars */}
      <div className="search-filter-container">
        <input
          type="text"
          placeholder="Search by keyword"
          value={query}
          onChange={handleSearchChange}
          className="search-bar"
        />
        <select
          value={category}
          onChange={handleCategoryChange}
          className="filter-bar"
        >
          <option value="">All Categories</option>
          {/* Dynamically load tags from the database */}
          {tags.map((tag) => (
            <option key={tag._id} value={tag._id}>
              {tag.name}
            </option>
          ))}
        </select>
      </div>

      {/* Display Resources */}
      <div className="resources-list">
        {filteredResources.length > 0 ? (
          filteredResources.map((resource) => (
            <div key={resource._id} className="resource-card">
              <h4>{resource.fileName}</h4>
              <p>{resource.description}</p>
              {/* <p>{resource.tags}</p> */}
              <p>Uploaded by: {resource.uploadedBy}</p>
              <button
                className="open-resource-btn"
                onClick={() => window.open(resource.fileUrl, "_blank")}
              >
                Open Resource
              </button>
            </div>
          ))
        ) : (
          <div>No resources found</div>
        )}
      </div>
    </div>
  );
};

export default BrowseResources;

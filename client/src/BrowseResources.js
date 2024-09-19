import React, { useState, useEffect } from "react";
import { fetchPopularResources, searchResources } from "./api/apiServices";
import "./BrowseResources.css";

const BrowseResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 10; // Limit resources per page to 10

  // Fetch popular resources
  const fetchResources = async (page, searchTerm = "") => {
    setLoading(true);
    try {
      let data;
      if (searchTerm) {
        data = await searchResources(searchTerm, page, limit);
      } else {
        data = await fetchPopularResources(page, limit);
      }
      setResources(data.data);
      setTotalPages(data.totalPages);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load resources.");
      setLoading(false);
    }
  };

  // Handle search input
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page when searching
    fetchResources(1, searchTerm);
  };

  // Fetch resources on page load and whenever `page` or `searchTerm` changes
  useEffect(() => {
    fetchResources(page, searchTerm);
  }, [page]);

  if (loading) return <div>Loading resources...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="browse-resources-container">
      <h2>Browse Resources</h2>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search resources..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {/* Resource Grid */}
      <div className="resources-grid">
        {resources.map((resource) => (
          <div key={resource._id} className="resource-card">
            <h4>{resource.fileName}</h4>
            <p>{resource.description}</p>
            <button
              className="open-resource-btn"
              onClick={() => window.open(resource.fileUrl, "_blank")}
            >
              Open Resource
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BrowseResources;

import React, { useState, useEffect, useRef } from "react";
import {
  browseResources,
  fetchUserResources,
  fetchAllTags,
} from "../api/apiServices";
import { useSelector } from "react-redux";
import * as pdfjsLib from "pdfjs-dist/webpack";
import { useNavigate } from "react-router-dom";
import "./Resources.css";
import Header from "../components/Header";
import UploadResource from "../pages/UploadResource"; // Import the upload modal

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [userResources, setUserResources] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMyResources, setShowMyResources] = useState(false);
  const [isUploadResourceOpen, setIsUploadResourceOpen] = useState(false); // State to handle modal visibility

  const token = localStorage.getItem("accessToken");
  const canvasRefs = useRef([]);
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [accessLevel] = useState("public");

  const [selectedType, setSelectedType] = useState("");

  const userProfile = useSelector((state) => state.user.profile);

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

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        const data = await browseResources(token, { accessLevel: "public" });
        setResources(data);
        setFilteredResources(data);
        setLoading(false);
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

      setFilteredResources(updatedResources);
    };

    filterResourcesLocally();
  }, [query, category, resources]);

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

      await page.render(renderContext).promise;
      console.log("Page rendered");
    } catch (reason) {
      console.error("Error rendering PDF:", reason);
    }
  };

  const renderUserResources = () => {
    return (
      <>
        <div
          className="backdrop"
          onClick={() => setShowMyResources(false)}
        ></div>
        <div className="my-resources-modal">
          <button onClick={() => setShowMyResources(false)}>&times;</button>
          <h2>My Resources</h2>
          <div className="resources-view grid">
            {userResources.length > 0 ? (
              userResources.map((resource, index) => (
                <div
                  key={resource._id}
                  className="resource-card"
                  onClick={() =>
                    navigate(`/resources/view/${resource._id}`, {
                      replace: true,
                    })
                  }
                >
                  <div className="resource-thumbnail">
                    {resource.fileUrl.endsWith(".pdf") ? (
                      <canvas
                        ref={(el) => (canvasRefs.current[index] = el)}
                      ></canvas>
                    ) : (
                      <img src={resource.fileUrl} alt={resource.fileName} />
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
      </>
    );
  };

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
    setCategory(""); // Reset category when type changes
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const groupedTagsByType = tags.reduce((acc, tag) => {
    const { type } = tag;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(tag);
    return acc;
  }, {});

  const openUploadResource = () => {
    setIsUploadResourceOpen(true);
  };

  const closeUploadResource = () => {
    setIsUploadResourceOpen(false);
  };

  if (loading) return <div>Loading resources...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div
      className={`resources-container ${isUploadResourceOpen ? "blur" : ""}`}
    >
      <Header userProfile={userProfile} />
      <h2>Browse Resources</h2>
      <div className="search-filter-container">
        <input
          type="text"
          placeholder="Search by keyword"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-bar"
        />

        {/* Dropdown for selecting tag type */}
        <select
          value={selectedType}
          onChange={handleTypeChange}
          className="filter-bar"
        >
          <option value="">Select Type</option>
          <option value="department">Department</option>
          <option value="course">Course</option>
          <option value="branch">Branch</option>
          <option value="subject">Subject</option>
        </select>

        {/* Dropdown for selecting tag under the selected type */}
        <select
          value={category}
          onChange={handleCategoryChange}
          className="filter-bar"
        >
          <option value="">All Categories</option>
          {groupedTagsByType[selectedType] &&
            groupedTagsByType[selectedType].map((tag) => (
              <option key={tag._id} value={tag._id}>
                {tag.name}
              </option>
            ))}
        </select>
      </div>

      <div className="upload-resource">
        <button onClick={openUploadResource} className="upload-button">
          Upload Resource
        </button>
      </div>

      <div className="resources-view grid">
        {filteredResources.length > 0 ? (
          filteredResources.map((resource, index) => (
            <div
              key={resource._id}
              className="resource-card"
              onClick={() => navigate(`/resources/view/${resource._id}`)}
            >
              <div className="resource-thumbnail">
                {resource.fileUrl.endsWith(".pdf") ? (
                  <canvas
                    ref={(el) => (canvasRefs.current[index] = el)}
                  ></canvas>
                ) : (
                  <img src={resource.fileUrl} alt={resource.fileName} />
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

      {showMyResources && renderUserResources()}

      {isUploadResourceOpen && <UploadResource onClose={closeUploadResource} />}
    </div>
  );
};

export default Resources;

import React, { useState, useEffect, useRef } from "react";
import { fetchUserResources } from "../api/apiServices";
import { useNavigate } from "react-router-dom";
import * as pdfjsLib from "pdfjs-dist/webpack";
import "./MyUploads.css";

const MyUploads = () => {
  const [resources, setResources] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const canvasRefs = useRef([]); // Array to hold refs for each resource's canvas
  const token = localStorage.getItem("accessToken");
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const data = await fetchUserResources(token);
        setResources(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load resources.");
        setLoading(false);
      }
    };
    fetchResources();
  }, [token]);
  const renderPDF = (fileUrl, index) => {
    const loadingTask = pdfjsLib.getDocument(fileUrl);
    loadingTask.promise.then(
      (pdf) => {
        pdf.getPage(1).then((page) => {
          const scale = 1.5;
          const viewport = page.getViewport({ scale });
          const canvas = canvasRefs.current[index]; // Access the correct canvas using index
          const context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };
          const renderTask = page.render(renderContext);
          renderTask.promise.then(() => {
            console.log("Page rendered");
          });
        });
      },
      (reason) => {
        console.error(reason);
      }
    );
  };
  useEffect(() => {
    resources.forEach((resource, index) => {
      if (resource.fileUrl.endsWith(".pdf")) {
        renderPDF(resource.fileUrl, index);
      }
    });
  }, [resources]);
  if (loading) return <div>Loading resources...</div>;
  if (error) return <div>{error}</div>;
  const handleUploadResource = () => {
    navigate("/resources/upload", { replace: true });
  };
  return (
    <div className="my-resources-container">
      <h2>My Resources</h2>
      {/* Upload Resource Button */}
      <button className="upload-resource-btn" onClick={handleUploadResource}>
        Upload Resource
      </button>
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
        {resources.map((resource, index) => {
          return (
            <div key={resource._id} className="resource-card">
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
                <button
                  className="open-resource-btn"
                  onClick={() => window.open(resource.fileUrl, "_blank")}
                >
                  Open Resource
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default MyUploads;

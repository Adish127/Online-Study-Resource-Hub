import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchResourceDetails,
  fetchCommentsForResource,
  addCommentToResource,
} from "../api/apiServices";
import * as pdfjsLib from "pdfjs-dist/webpack";
import {
  FaHeart,
  FaArrowLeft,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import "./ViewResource.css";

const ViewResource = () => {
  const { resourceId } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const canvasRef = useRef(null);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const data = await fetchResourceDetails(token, resourceId);
        setResource(data);
        await fetchComments();
        setLoading(false);
        setTotalPages(
          data.fileUrl.endsWith(".pdf") ? await getTotalPages(data.fileUrl) : 0
        );
      } catch (err) {
        console.error(err);
        setError("Failed to load resource details.");
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        const commentsData = await fetchCommentsForResource(token, resourceId);
        setComments(commentsData);
      } catch (err) {
        console.error(err);
        setError("Failed to load comments.");
      }
    };

    fetchResource();
  }, [resourceId, token]);

  const getTotalPages = async (fileUrl) => {
    const loadingTask = pdfjsLib.getDocument(fileUrl);
    const pdf = await loadingTask.promise;
    return pdf.numPages;
  };

  const renderPDF = async (fileUrl) => {
    const loadingTask = pdfjsLib.getDocument(fileUrl);
    try {
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(pageNumber);
      const scale = 1.5;
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;
    } catch (reason) {
      console.error("Error rendering PDF:", reason);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment) {
      try {
        await addCommentToResource(token, resourceId, newComment);
        setComments((prevComments) => [
          ...prevComments,
          { text: newComment, user: { id: "currentUser" } },
        ]);
        setNewComment("");
      } catch (err) {
        console.error(err);
        setError("Failed to add comment.");
      }
    }
  };

  const handleLike = () => {
    // Handle the like functionality here
  };

  const handlePreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
      renderPDF(resource.fileUrl);
    }
  };

  const handleNextPage = () => {
    if (pageNumber < totalPages) {
      setPageNumber(pageNumber + 1);
      renderPDF(resource.fileUrl);
    }
  };

  if (loading) return <div>Loading resource...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="view-resource-container">
      <div className="back-button" onClick={() => navigate(-1)}>
        <FaArrowLeft />
      </div>

      <div className="resource-details">
        <h2>{resource.fileName}</h2>
        <p>{resource.description}</p>

        {resource.fileUrl.endsWith(".pdf") ? (
          <div className="pdf-preview">
            <canvas ref={canvasRef}></canvas>
            <div className="pagination-controls">
              <FaChevronLeft
                onClick={handlePreviousPage}
                className="pagination-arrow"
              />
              <span>
                {pageNumber} / {totalPages}
              </span>
              <FaChevronRight
                onClick={handleNextPage}
                className="pagination-arrow"
              />
            </div>
            <div
              className="open-in-new-tab"
              onClick={() => window.open(resource.fileUrl, "_blank")}
            >
              Open in New Tab
            </div>
          </div>
        ) : (
          <div className="image-preview">
            <img src={resource.fileUrl} alt={resource.fileName} />
          </div>
        )}

        <div className="resource-tags">
          <h3>Tags:</h3>
          <p>{resource.tags.join(", ")}</p>
        </div>

        <div className="resource-actions">
          <FaHeart onClick={handleLike} className="like-icon" />
        </div>
      </div>

      <div className="comments-section">
        <h3>Comments:</h3>
        <ul className="comments-list">
          {comments.map((comment, index) => (
            <li key={index} className="comment-item">
              <div className="comment-content">
                <strong>{comment.user}</strong>: {comment.text}
              </div>
            </li>
          ))}
        </ul>

        <form onSubmit={handleCommentSubmit} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            required
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default ViewResource;

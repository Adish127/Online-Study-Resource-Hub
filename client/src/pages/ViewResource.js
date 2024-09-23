import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  fetchResourceDetails,
  fetchCommentsForResource,
  addCommentToResource,
} from "../api/apiServices"; // Ensure these functions are imported
import * as pdfjsLib from "pdfjs-dist/webpack";
import "./ViewResource.css";

const ViewResource = () => {
  const { resourceId } = useParams();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const canvasRef = useRef(null);
  const token = localStorage.getItem("accessToken"); // Assuming you store the token in localStorage

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const data = await fetchResourceDetails(token, resourceId);
        setResource(data);
        await fetchComments();
        setLoading(false);

        if (data.fileUrl.endsWith(".pdf")) {
          renderPDF(data.fileUrl);
        }
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

  const renderPDF = async (fileUrl) => {
    const loadingTask = pdfjsLib.getDocument(fileUrl);
    try {
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);
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
        setNewComment(""); // Clear input field
      } catch (err) {
        console.error(err);
        setError("Failed to add comment.");
      }
    }
  };

  if (loading) return <div>Loading resource...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="view-resource-container">
      <div className="resource-post">
        <h2>{resource.fileName}</h2>
        <p>{resource.description}</p>

        {resource.fileUrl.endsWith(".pdf") ? (
          <div className="pdf-preview">
            <canvas ref={canvasRef}></canvas>
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
          <button onClick={() => window.open(resource.fileUrl, "_blank")}>
            Open Resource in New Tab
          </button>
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

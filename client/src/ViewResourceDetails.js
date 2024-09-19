import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchResourceDetails,
  fetchComments,
  addComment,
} from "./api/apiServices"; // Mock API calls
import "./ViewFileDetails.css";

const ViewFileDetails = () => {
  const { id } = useParams(); // Get the file ID from the URL
  const [resource, setResource] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const getResourceDetails = async () => {
      try {
        const data = await fetchResourceDetails(id); // Fetch resource details
        setResource(data);
      } catch (err) {
        setError("Failed to load resource details.");
      }
    };

    const getComments = async () => {
      try {
        const commentsData = await fetchComments(id); // Fetch comments for the resource
        setComments(commentsData);
      } catch (err) {
        setError("Failed to load comments.");
      }
    };

    getResourceDetails();
    getComments();
  }, [id]);

  const handleAddComment = async () => {
    if (newComment.trim() === "") return;
    try {
      await addComment(id, newComment); // Call API to add a comment
      setComments([...comments, { text: newComment }]); // Update comments state
      setNewComment("");
    } catch (err) {
      setError("Failed to add comment.");
    }
  };

  if (!resource) return <div>Loading resource details...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="file-details-container">
      <h2>{resource.fileName}</h2>
      <p>{resource.description}</p>
      <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer">
        Open File
      </a>

      <div className="comments-section">
        <h3>Comments</h3>
        <div className="comments-list">
          {comments.map((comment, index) => (
            <div key={index} className="comment">
              {comment.text}
            </div>
          ))}
        </div>

        <div className="add-comment">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add your comment"
          />
          <button onClick={handleAddComment}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default ViewFileDetails;

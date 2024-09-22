import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { uploadResource } from "./api/apiServices"; // Import the API service
import * as pdfjsLib from "pdfjs-dist/webpack"; // Import pdfjs-dist for PDF rendering
import TagsDropdown from "./TagsDropdown"; // Import the TagsDropdown component
import { setPopup } from "./features/popupsSlice"; // Import popup action
import "./UploadResource.css";

const UploadResource = () => {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [error, setError] = useState("");
  const [previewSrc, setPreviewSrc] = useState(""); // For image and PDF previews
  const [selectedTags, setSelectedTags] = useState([]); // Array to store selected tag IDs
  const [loading, setLoading] = useState(false); // Loading state
  const token = localStorage.getItem("accessToken");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError("");
      previewFile(selectedFile); // Generate preview
    }
  };

  const previewFile = (file) => {
    const fileType = file.type;

    // Preview images
    if (fileType.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewSrc(reader.result); // Set image source to display
      };
      reader.readAsDataURL(file);
    }

    // Preview PDFs (First page)
    else if (fileType === "application/pdf") {
      const reader = new FileReader();
      reader.onloadend = () => {
        const typedArray = new Uint8Array(reader.result);
        pdfjsLib.getDocument(typedArray).promise.then((pdf) => {
          pdf.getPage(1).then((page) => {
            const scale = 1.5;
            const viewport = page.getViewport({ scale });
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
              canvasContext: context,
              viewport: viewport,
            };
            page.render(renderContext).promise.then(() => {
              setPreviewSrc(canvas.toDataURL()); // Set PDF first page preview
            });
          });
        });
      };
      reader.readAsArrayBuffer(file);
    } else {
      setPreviewSrc(""); // For unsupported file types, don't preview
    }
  };

  const handleTagSelection = (selectedTagIds) => {
    setSelectedTags(selectedTagIds); // Store selected tag IDs
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); // Set loading state to true

    // Validate required fields
    if (!file || !title || !category || selectedTags.length === 0) {
      setError("Please fill in all required fields and select tags.");
      setLoading(false); // Set loading state to false
      return;
    }

    // Create FormData for the file upload
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("visibility", visibility);

    // Append each selected tag individually
    selectedTags.forEach((tagId) => {
      formData.append("tags[]", tagId); // Add each tag ID
    });

    console.log(formData.get("tags[]"));

    try {
      // Call the uploadResource function and pass the token and formData
      await uploadResource(token, formData); // Pass token and formData to API function

      dispatch(
        setPopup({
          message: "Resource uploaded successfully!",
          type: "success",
        })
      );
    } catch (err) {
      setError("Error uploading resource. Please try again.");
      dispatch(
        setPopup({
          message: "Error uploading resource. Please try again.",
          type: "error",
        })
      );
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  return (
    <div className="upload-resource-container">
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
      <h2>Upload New Resource</h2>

      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleUpload}>
        <div className="form-group">
          <label htmlFor="file">Choose file:</label>
          <input type="file" id="file" onChange={handleFileChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tags:</label>
          <TagsDropdown onTagSelect={handleTagSelection} />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            <option value="book">Book</option>
            <option value="video">Video</option>
            <option value="audio">Audio</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="visibility">Visibility:</label>
          <select
            id="visibility"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>

        <button type="submit" className="upload-button" disabled={loading}>
          Upload Resource
        </button>
      </form>

      {previewSrc && (
        <div className="file-preview">
          <h4>File Preview:</h4>
          {file.type.startsWith("image/") || file.type === "application/pdf" ? (
            <img src={previewSrc} alt="File Preview" />
          ) : (
            <p>Preview not available for this file type.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadResource;

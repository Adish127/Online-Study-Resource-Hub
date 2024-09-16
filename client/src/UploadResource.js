import React, { useState, useEffect } from "react";
import { uploadResource } from "./api/apiServices"; // Import the API service
import * as pdfjsLib from "pdfjs-dist/webpack"; // Import pdfjs-dist for PDF rendering
import "./UploadResource.css";

const UploadResource = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [previewSrc, setPreviewSrc] = useState(""); // For image and PDF previews
  const [token] = useState(localStorage.getItem("accessToken").toString()); // Replace this with how you manage tokens

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

  const handleUpload = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    // Validate required fields
    if (!file || !title || !category) {
      setError("Please fill in all required fields.");
      return;
    }

    // Create FormData for the file upload
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("tags", tags);
    formData.append("category", category);
    formData.append("visibility", visibility);

    try {
      // Call the uploadResource function and pass the token and formData
      await uploadResource(token, formData); // Pass token and formData to API function
      setSuccess("Resource uploaded successfully!");
    } catch (err) {
      setError("Error uploading resource. Please try again.");
    }
  };

  return (
    <div className="upload-resource-container">
      <h2>Upload New Resource</h2>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

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
          <label htmlFor="tags">Tags (comma-separated):</label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
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
            <option value="books">Books</option>
            <option value="notes">Notes</option>
            <option value="presentations">Presentations</option>
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

        <button type="submit" className="upload-button">
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

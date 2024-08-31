import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { completeProfile } from "./api/apiServices";

const CompleteRegistration = () => {
  const [formData, setFormData] = useState({
    name: "",
    role: "student",
    department: "",
    bio: "",
    profilePicture: "",
    interests: "",
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await completeProfile(token, formData);

      if (response.ok) {
        navigate("/dashboard"); // Navigate to dashboard after successful registration
      } else {
        const errorData = await response.json();
        setError(
          errorData.message ||
            "Failed to complete registration. Please try again."
        );
      }
    } catch (error) {
      console.error("Error completing registration:", error);
      setError("Failed to complete registration. Please try again.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Complete Registration</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Role:</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Department:</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Bio:</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Profile Picture URL:</label>
          <input
            type="text"
            name="profilePicture"
            value={formData.profilePicture}
            onChange={handleChange}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Interests (comma-separated):</label>
          <input
            type="text"
            name="interests"
            value={formData.interests}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CompleteRegistration;

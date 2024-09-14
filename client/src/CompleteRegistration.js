import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUserProfile, setLoading, setError } from "./features/userSlice";
import {
  completeProfile,
  updateProfilePicture,
  fetchUserProfile,
} from "./api/apiServices";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import "./CompleteRegistration.css";

const CompleteRegistration = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userProfile = useSelector((state) => state.user.profile);
  const userStatus = useSelector((state) => state.user.status);
  const [profileData, setProfileData] = useState({
    name: "",
    department: "",
    bio: "",
    interests: [],
  });
  const [profilePicture, setProfilePicture] = useState("");
  const [dragging, setDragging] = useState(false);
  const [loading, setLoadingState] = useState(false);
  const [error, setErrorState] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    dispatch(setLoading("loading"));
    fetchUserProfile(token)
      .then((response) => {
        dispatch(setUserProfile(response));
        setProfileData({
          name: response.name || "",
          department: response.department || "",
          bio: response.bio || "",
          interests: response.interests || [],
        });
        setProfilePicture(response.profilePicture || "");
        dispatch(setLoading("succeeded"));
      })
      .catch((err) => {
        dispatch(setError("Failed to fetch user profile."));
        dispatch(setLoading("failed"));
        setErrorState("Failed to fetch user profile.");
      });
  }, [dispatch, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setProfilePicture(URL.createObjectURL(file));
      setProfileData((prevData) => ({
        ...prevData,
        profilePictureFile: file,
      }));
    }
    setDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handlePhotoClick = (e) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        setProfilePicture(URL.createObjectURL(file));
        setProfileData((prevData) => ({
          ...prevData,
          profilePictureFile: file,
        }));
      }
    };
    input.click();
  };

  const handleSaveProfile = async () => {
    setLoadingState(true);
    setErrorState(null);
    try {
      const token = localStorage.getItem("token");
      await completeProfile(token, profileData);

      if (profileData.profilePictureFile) {
        const formData = new FormData();
        formData.append("file", profileData.profilePictureFile);
        await updateProfilePicture(token, formData);
      }

      // Manually dispatch profile update
      const updatedProfile = await fetchUserProfile(token);
      dispatch(setUserProfile(updatedProfile));
      navigate("/dashboard", { replace: true });
    } catch (error) {
      dispatch(setError("Failed to update profile. Please try again."));
      setErrorState("Failed to update profile. Please try again.");
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <div className="complete-registration-container">
      <Header userProfile={userProfile} />
      <div className="complete-registration-main">
        <Sidebar />

        <div className="complete-registration-content">
          {loading && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
            </div>
          )}
          <h1>Complete Your Profile</h1>
          <div className="profile-photo-section">
            <div className="profile-photo-upload-text">
              Drag and drop or click to upload
            </div>
            <div
              className={`profile-photo-dropzone ${dragging ? "dragging" : ""}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={handlePhotoClick}
            >
              <img
                src={profilePicture}
                className="profile-photo"
                alt="Profile"
              />
            </div>
          </div>
          <form className="profile-form-modern">
            <div className="form-row">
              <div className="form-col">
                <label>Email:</label>
                <input
                  type="text"
                  value={userProfile?.email || ""}
                  disabled
                  className="disabled-input-modern"
                />
              </div>
              <div className="form-col">
                <label>Username:</label>
                <input
                  type="text"
                  value={userProfile?.username || ""}
                  disabled
                  className="disabled-input-modern"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-col">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  className="text-input-modern"
                />
              </div>
              <div className="form-col">
                <label>Department:</label>
                <input
                  type="text"
                  name="department"
                  value={profileData.department}
                  onChange={handleInputChange}
                  className="text-input-modern"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-col">
                <label>Bio:</label>
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleInputChange}
                  className="textarea-input-modern"
                />
              </div>
              <div className="form-col">
                <label>Interests:</label>
                <input
                  type="text"
                  name="interests"
                  value={profileData.interests.join(", ")}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      interests: e.target.value
                        .split(",")
                        .map((item) => item.trim()),
                    })
                  }
                  className="text-input-modern"
                />
              </div>
            </div>
            {error && <p className="error-message-modern">{error}</p>}
            <button
              type="button"
              onClick={handleSaveProfile}
              className="save-button-modern"
              disabled={loading}
            >
              Save Profile
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CompleteRegistration;

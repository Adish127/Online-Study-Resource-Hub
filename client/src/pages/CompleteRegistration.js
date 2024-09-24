import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUserProfile, setLoading, setError } from "../features/userSlice";
import {
  completeProfile,
  updateProfilePicture,
  fetchUserProfile,
  fetchAllTags,
} from "../api/apiServices";
import { setPopup } from "../features/popupsSlice";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
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
    gender: "",
    dob: "",
    alternateEmail: "",
    degree: "",
    batch: "",
  });
  const [profilePicture, setProfilePicture] = useState("");
  const [dragging, setDragging] = useState(false);
  const [loading, setLoadingState] = useState(false);
  const [error, setErrorState] = useState(null);
  const [availableTags, setAvailableTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

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
          gender: response.bio?.gender || "", // Add gender
          dob: response.bio?.dob || "", // Add dob
          alternateEmail: response.bio?.alternateEmail || "", // Add alternateEmail
          degree: response.bio?.degree || "", // Add degree
          batch: response.bio?.batch || "", // Add batch
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

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    fetchAllTags(token)
      .then((tags) => {
        const subjectTags = tags.filter((tag) => tag.type === "subject");
        setAvailableTags(subjectTags);
      })
      .catch((err) => {
        setErrorState("Failed to fetch tags.");
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const addInterest = (interest) => {
    if (!profileData.interests.includes(interest)) {
      setProfileData((prevData) => ({
        ...prevData,
        interests: [...prevData.interests, interest],
      }));
      setSearchTerm(""); // Clear the search input after adding
    }
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
      const token = localStorage.getItem("accessToken");
      await completeProfile(token, profileData);

      if (profileData.profilePictureFile) {
        const formData = new FormData();
        formData.append("file", profileData.profilePictureFile);
        await updateProfilePicture(token, formData);
      }

      const updatedProfile = await fetchUserProfile(token);
      dispatch(setUserProfile(updatedProfile));

      // Dispatch success popup
      dispatch(
        setPopup({
          message: "Profile updated successfully!",
          type: "success",
        })
      );

      navigate("/dashboard", { replace: true });
    } catch (error) {
      dispatch(setError("Failed to update profile. Please try again."));

      // Dispatch error popup
      dispatch(
        setPopup({
          message: "Failed to update profile. Please try again.",
          type: "error",
        })
      );
    } finally {
      setLoadingState(false);
    }
  };

  const filteredTags = availableTags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !profileData.interests.includes(tag.name) // Exclude already selected tags
  );

  return (
    <div className="complete-registration-container">
      <Header userProfile={userProfile} />
      <div className="complete-registration-main">
        <div className="complete-registration-content">
          {loading && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
            </div>
          )}
          <h1>Complete Your Profile</h1>
          <div className="profile-photo-section">
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
            </div>
            <div className="form-row">
              <div className="form-col">
                <label>Gender:</label>
                <select
                  name="gender"
                  value={profileData.gender}
                  onChange={handleInputChange}
                  className="text-input-modern"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-col">
                <label>Date of Birth:</label>
                <input
                  type="date"
                  name="dob"
                  value={profileData.dob}
                  onChange={handleInputChange}
                  className="text-input-modern"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-col">
                <label>Alternate Email:</label>
                <input
                  type="email"
                  name="alternateEmail"
                  value={profileData.alternateEmail}
                  onChange={handleInputChange}
                  className="text-input-modern"
                />
              </div>
              <div className="form-col">
                <label>Degree:</label>
                <input
                  type="text"
                  name="degree"
                  value={profileData.degree}
                  onChange={handleInputChange}
                  className="text-input-modern"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-col">
                <label>Batch:</label>
                <input
                  type="text"
                  name="batch"
                  value={profileData.batch}
                  onChange={handleInputChange}
                  className="text-input-modern"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-col">
                <label>Interests:</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="text-input-modern"
                  placeholder="Search and add interests"
                />
                <div className="available-tags">
                  {filteredTags.map((tag) => (
                    <div
                      key={tag.id}
                      className="tag-item"
                      onClick={() => addInterest(tag.name)}
                    >
                      {tag.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="form-row">
              <button
                type="button"
                onClick={handleSaveProfile}
                className="save-button-modern"
              >
                Save Profile
              </button>
            </div>
            {error && <div className="error-message">{error}</div>}
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CompleteRegistration;

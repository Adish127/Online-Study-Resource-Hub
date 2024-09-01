import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { completeProfile } from "./api/apiServices";
import { setUserProfile } from "./features/userSlice";
import "./CompleteRegistration.css"; // Import your custom CSS

const CompleteRegistration = () => {
  const userProfile = useSelector((state) => state.user.profile);
  const [profileData, setProfileData] = useState({
    name: userProfile?.name || "",
    department: userProfile?.department || "",
    bio: userProfile?.bio || "",
    interests: userProfile?.interests || [],
  });
  const [profilePicture, setProfilePicture] = useState(
    userProfile?.profilePicture || ""
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    // Here you can handle the file upload
    // For example, upload to Cloudinary and then update profile picture URL
    // Once uploaded, update the profile picture URL in state
    // Example:
    // uploadFile(file).then((url) => setProfilePicture(url));
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const updatedProfile = await completeProfile(token, profileData);

      // Update the profile in Redux store
      dispatch(setUserProfile(updatedProfile));

      // Redirect to the dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  return (
    <div className="complete-registration-container">
      <h1>Complete Your Profile</h1>
      <div className="profile-photo-section">
        <img src={profilePicture} alt="Profile" className="profile-photo" />
        <label className="choose-photo-link">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="file-input"
          />
          Choose New Picture
        </label>
      </div>
      <form className="profile-form">
        <label>
          Email:
          <input
            type="text"
            value={userProfile?.email || ""}
            disabled
            className="disabled-input"
          />
        </label>
        <label>
          Username:
          <input
            type="text"
            value={userProfile?.username || ""}
            disabled
            className="disabled-input"
          />
        </label>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={profileData.name}
            onChange={handleInputChange}
            className="text-input"
          />
        </label>
        <label>
          Department:
          <input
            type="text"
            name="department"
            value={profileData.department}
            onChange={handleInputChange}
            className="text-input"
          />
        </label>
        <label>
          Bio:
          <textarea
            name="bio"
            value={profileData.bio}
            onChange={handleInputChange}
            className="textarea-input"
          />
        </label>
        <label>
          Interests:
          <input
            type="text"
            name="interests"
            value={profileData.interests.join(", ")}
            onChange={(e) =>
              setProfileData({
                ...profileData,
                interests: e.target.value.split(",").map((item) => item.trim()),
              })
            }
            className="text-input"
          />
        </label>
        <button
          type="button"
          onClick={handleSaveProfile}
          className="save-button"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default CompleteRegistration;

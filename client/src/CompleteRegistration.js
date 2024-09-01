import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { completeProfile } from "./api/apiServices";
import { setUserProfile } from "./features/userSlice";

const CompleteRegistration = () => {
  const userProfile = useSelector((state) => state.user.profile); // Get user profile from Redux
  const [profileData, setProfileData] = useState({
    name: userProfile?.name || "",
    department: userProfile?.department || "",
    bio: userProfile?.bio || "",
    interests: userProfile?.interests || [],
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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
      // Handle error (e.g., show a message to the user)
    }
  };

  return (
    <div>
      <h1>Complete Your Profile</h1>
      <form>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={profileData.name}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Department:
          <input
            type="text"
            name="department"
            value={profileData.department}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Bio:
          <textarea
            name="bio"
            value={profileData.bio}
            onChange={handleInputChange}
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
          />
        </label>
        {/* Add more form fields as necessary */}
        <button type="button" onClick={handleSaveProfile}>
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default CompleteRegistration;

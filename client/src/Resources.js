import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const Resources = () => {
  const userProfile = useSelector((state) => state.user.profile);
  // const userProfile = null; // Replace null with the selector that retrieves the user profile from the Redux store

  useEffect(() => {
    if (userProfile) {
      console.log("User profile in Resources:", userProfile);
      // Perform any additional logic that requires userProfile here
    }
  }, [userProfile]);

  return (
    <div>
      <h1>Resources</h1>
      {userProfile ? (
        <p>Welcome, {userProfile.username}! Here are your resources:</p>
      ) : (
        <p>Loading user profile...</p>
      )}
      {/* Add logic to display user's resources based on userProfile */}
    </div>
  );
};

export default Resources;

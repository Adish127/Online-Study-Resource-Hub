import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile } from "./api/apiServices";

const Dashboard = () => {
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token") || localStorage.getItem("token");

        if (!token) {
          console.log("No token found");
          navigate("/login");
          return;
        }

        // Fetch user profile
        const userProfileData = await fetchUserProfile(token);

        if (!userProfileData.isProfileComplete) {
          // Redirect to profile completion page if profile is not completed
          navigate("/profile-completion");
          return;
        }

        setUserProfile(userProfileData);
        navigate("/dashboard", { replace: true }); // Ensure proper navigation
      } catch (error) {
        console.error("Error fetching data:", error);
        navigate("/login");
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <div>
      <h1>Dashboard</h1>
      {userProfile ? (
        <div>
          <p>Welcome, {userProfile.email}!</p>
          {/* Display other user profile details */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;

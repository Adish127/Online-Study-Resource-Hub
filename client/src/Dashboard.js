import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Extract token from URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      // If no token is found, redirect to login
      console.log("No token found");
      navigate("/login");
    } else {
      // Fetch user profile
      localStorage.setItem("token", token);
      fetchUserProfile(token);
    }
  }, [navigate]);

  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch(
        "http://localhost:5001/api/v2/users/profile",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const profileData = await response.json();
        setUserProfile(profileData);

        // Update URL with user ID
        navigate("/dashboard");
      } else {
        // Handle unauthorized or error response
        navigate("/login");
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      navigate("/login");
    }
  };

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

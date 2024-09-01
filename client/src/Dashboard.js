import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUserProfile } from "./features/userSlice";
import { fetchUserProfile } from "./api/apiServices";
import "./Dashboard.css"; // Import your custom CSS

const Dashboard = () => {
  const dispatch = useDispatch();
  const userProfile = useSelector((state) => state.user.profile);
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

        localStorage.setItem("token", token);

        // Fetch user profile data
        const userProfileData = await fetchUserProfile(token);
        dispatch(setUserProfile(userProfileData));
        console.log("Dispatched userProfileData:", userProfileData);

        // Check if profile is complete and navigate accordingly
        if (!userProfileData.isProfileComplete) {
          navigate("/profile-completion");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        navigate("/login");
      }
    };

    fetchData();
  }, [dispatch, navigate]);

  useEffect(() => {
    // This effect runs after the profile is updated
    if (userProfile) {
      if (!userProfile.isProfileComplete) {
        navigate("/profile-completion");
      }
    }
  }, [userProfile, navigate]);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="profile-card">
          {userProfile && (
            <>
              <Link to="/profile-completion">
                <img
                  src={userProfile.profilePicture}
                  alt="Profile"
                  className="profile-picture-large"
                />
              </Link>
              <h3>{userProfile.name}</h3>
              <p>{userProfile.role}</p>
            </>
          )}
        </div>
        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/resources">My Resources</Link>
          <Link to="/study-groups">Study Groups</Link>
          <Link to="/notifications">Notifications</Link>
          <Link to="/interests">Interests</Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="navbar">
          <div className="navbar-left">Resource Hub</div>
          <div className="navbar-right">
            {userProfile && (
              <>
                <img
                  src={userProfile.profilePicture}
                  alt="Profile"
                  className="profile-image"
                />
                <span className="profile-username">{userProfile.username}</span>
              </>
            )}
          </div>
        </div>

        <div className="dashboard-content">
          <h1>Welcome, {userProfile?.username}!</h1>
          <p>
            Here you can manage your resources, view study groups, and more.
          </p>
          {/* Additional content can be added here */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

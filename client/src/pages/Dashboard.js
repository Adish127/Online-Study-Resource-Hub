import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUserProfile, setLoading, setError } from "../features/userSlice";
import { setResources } from "../features/resourceSlice";
import {
  fetchUserProfile,
  refreshAccessToken,
  fetchUserResources,
} from "../api/apiServices";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Popup from "../components/Popup";
import "./Dashboard.css";

const Dashboard = () => {
  const [popup, setPopup] = useState({ visible: false, message: "", type: "" });
  const dispatch = useDispatch();
  const userProfile = useSelector((state) => state.user.profile);
  const userStatus = useSelector((state) => state.user.status);
  const userResources = useSelector((state) => state.resource.resources);
  const navigate = useNavigate();

  useEffect(() => {
    const handleTokenManagement = async () => {
      let token = localStorage.getItem("accessToken");
      let refreshToken = localStorage.getItem("refreshToken");

      if (!token) {
        const urlParams = new URLSearchParams(window.location.search);
        const urlToken = urlParams.get("accessToken");
        const urlRefreshToken = urlParams.get("refreshToken");

        if (urlToken) {
          localStorage.setItem("accessToken", urlToken);
          if (urlRefreshToken) {
            localStorage.setItem("refreshToken", urlRefreshToken);
          }
          setPopup({
            visible: true,
            message: "Welcome",
            type: "success",
          });
          navigate("/dashboard", { replace: true });
        } else {
          navigate("/login");
          return;
        }
      }

      if (!userProfile && userStatus === "idle") {
        dispatch(setLoading("loading"));
        try {
          const response = await fetchUserProfile(token);
          dispatch(setUserProfile(response));
          dispatch(setLoading("succeeded"));
          const userResources = await fetchUserResources(token);
          dispatch(setResources(userResources));
        } catch (err) {
          if (err.message === "Token expired") {
            // Token might be expired, try refreshing
            try {
              // const refreshTok = userProfile?.refreshToken;
              const newTokens = await refreshAccessToken(refreshToken);
              localStorage.setItem("accessToken", newTokens.accessToken);
              // localStorage.setItem("refreshToken", newTokens.refreshToken);
              const response = await fetchUserProfile(newTokens.accessToken);
              dispatch(setUserProfile(response));
              dispatch(setLoading("succeeded"));
              const userResources = await fetchUserResources(
                newTokens.accessToken
              );
              dispatch(setResources(userResources));
            } catch (refreshErr) {
              dispatch(setError("Failed to refresh token."));
              dispatch(setLoading("failed"));
              localStorage.removeItem("accessToken");
              localStorage.removeItem("refreshToken");
              navigate("/login");
            }
          } else {
            dispatch(setError("Failed to fetch user profile."));
            dispatch(setLoading("failed"));
          }
        }
      }
    };
    handleTokenManagement();
  }, [dispatch, navigate, userProfile, userStatus]);

  useEffect(() => {
    if (userProfile && !userProfile.isProfileComplete) {
      navigate("/profile-completion");
    }
  }, [userProfile, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    dispatch(setUserProfile(null)); // Clear the user profile from Redux store
    navigate("/login"); // Redirect to login page
  };

  const handlePopupClose = () => {
    setPopup({ ...popup, visible: false });
  };

  if (userStatus === "loading") {
    return <div>Loading...</div>;
  }

  if (userStatus === "failed") {
    return <div>Error loading profile.</div>;
  }

  return (
    <div className="dashboard-container">
      <Header userProfile={userProfile} />

      <div className="main-container">
        <Sidebar />

        <main className="main-content">
          <section className="welcome-section">
            <h1>Welcome, {userProfile?.name}!</h1>
            <p>
              Here you can manage your resources, view study groups, and more.
            </p>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </section>

          <section className="quick-stats">
            <div className="stat-item">
              <h2>Resources</h2>
              <p>Manage your resources here.</p>
              {userResources.length > 0 && (
                <ul>
                  {userResources.map((resource) => (
                    <li key={resource._id}>{resource.fileName}</li>
                  ))}
                </ul>
              )}
            </div>
            <div className="stat-item">
              <h2>Study Groups</h2>
              <p>Join or create study groups.</p>
            </div>
            <div className="stat-item">
              <h2>Notifications</h2>
              <p>Check your recent notifications.</p>
            </div>
          </section>

          <section className="recent-activities">
            <h2>Recent Activities</h2>
            {/* Feed of recent activities */}
          </section>
        </main>
      </div>

      <Footer />

      {popup.visible && (
        <Popup
          message={popup.message}
          type={popup.type}
          onClose={handlePopupClose}
        />
      )}
    </div>
  );
};

export default Dashboard;

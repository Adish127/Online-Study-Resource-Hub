import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUserProfile, setLoading, setError } from "./features/userSlice";
import { fetchUserProfile } from "./api/apiServices";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import Popup from "./Popup";
import "./Dashboard.css";

const Dashboard = () => {
  const [popup, setPopup] = useState({ visible: false, message: "", type: "" });
  const dispatch = useDispatch();
  const userProfile = useSelector((state) => state.user.profile);
  const userStatus = useSelector((state) => state.user.status);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get("token");

      if (urlToken) {
        localStorage.setItem("token", urlToken);
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
      fetchUserProfile(token)
        .then((response) => {
          dispatch(setUserProfile(response));
          dispatch(setLoading("succeeded"));
        })
        .catch((err) => {
          dispatch(setError("Failed to fetch user profile."));
          dispatch(setLoading("failed"));
        });
    }
  }, [dispatch, navigate, userProfile, userStatus]);

  useEffect(() => {
    if (userProfile && !userProfile.isProfileComplete) {
      navigate("/profile-completion");
    }
  }, [userProfile, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
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

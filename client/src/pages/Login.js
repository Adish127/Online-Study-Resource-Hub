import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserProfile, setLoading, setError } from "../features/userSlice";
import { fetchUserProfile } from "../api/apiServices"; // Import your API service directly
import Popup from "../components/Popup"; // Assuming Popup component is available
import "./Login.css"; // Import the external CSS file

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Use this to get the tokens from URL params
  const dispatch = useDispatch();
  const [popup, setPopup] = useState({ visible: false, message: "", type: "" });

  const handleGoogleLogin = () => {
    // Redirect to your backend Google OAuth endpoint
    window.location.href = "http://localhost:5001/api/auth/google";
  };

  const showPopup = (message, type) => {
    setPopup({ visible: true, message, type });
    setTimeout(() => setPopup({ visible: false, message: "", type: "" }), 5000); // Auto-close after 5 seconds
  };

  const closePopup = () => {
    setPopup({ visible: false, message: "", type: "" });
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");

    if (accessToken && refreshToken) {
      // Store tokens in localStorage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // Clear the URL params (optional, for better UX)
      window.history.replaceState({}, document.title, "/login");
    }

    const token = accessToken || localStorage.getItem("accessToken");

    if (token) {
      dispatch(setLoading("loading")); // Set status to loading
      fetchUserProfile(token)
        .then((response) => {
          dispatch(setUserProfile(response));
          dispatch(setLoading("succeeded")); // Set status to succeeded
          navigate("/dashboard"); // Navigate to dashboard
        })
        .catch((err) => {
          dispatch(setError("Failed to fetch user profile."));
          dispatch(setLoading("failed")); // Set status to failed
          // Clear tokens and navigate to login page
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          showPopup("Login failed. Please try again.", "failure");

          // Wait for some time until the popup is completely shown
          navigate("/login"); // Redirect to login
        });
    }
  }, [dispatch, navigate, location.search]);

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Login</h1>
        <p className="login-subtitle">
          Welcome! Please login using your Google account.
        </p>
        <button className="login-button" onClick={handleGoogleLogin}>
          Login with Google
        </button>
      </div>

      {/* Display Popup when there's a failure */}
      {popup.visible && (
        <Popup message={popup.message} type={popup.type} onClose={closePopup} />
      )}
    </div>
  );
};

export default Login;

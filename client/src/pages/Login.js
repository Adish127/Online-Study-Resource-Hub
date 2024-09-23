import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserProfile, setLoading, setError } from "../features/userSlice";
<<<<<<< HEAD
import { fetchUserProfile } from "../api/apiServices"; // Import your API service directly
import Popup from "../components/Popup"; // Assuming Popup component is available
import "./Login.css"; // Import the external CSS file
=======
import { fetchUserProfile } from "../api/apiServices";
import Popup from "../components/Popup"; // Popup
import "./Login.css";
>>>>>>> 212ffda8ca201a78847554a304caa91e4f4963d5

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [popup, setPopup] = useState({ visible: false, message: "", type: "" });

  const handleGoogleLogin = () => {
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
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      window.history.replaceState({}, document.title, "/login");
    }

    const token = accessToken || localStorage.getItem("accessToken");

    if (token) {
      dispatch(setLoading("loading"));
      fetchUserProfile(token)
        .then((response) => {
          dispatch(setUserProfile(response));
          dispatch(setLoading("succeeded"));
          navigate("/dashboard");
        })
        .catch((err) => {
          console.error(err); // Log the error
          const errorMessage =
            err.response?.data?.message || "Failed to fetch user profile.";
          setPopup({ visible: true, message: errorMessage, type: "failure" });
          dispatch(setError("Failed to fetch user profile."));
          dispatch(setLoading("failed"));
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          showPopup("Login failed. Please try again.", "failure");

          // Wait for some time until the popup is completely shown
          navigate("/login"); // Redirect to login
        });
    }
  }, [dispatch, navigate, location.search]);

  const handleClosePopup = () => {
    setPopup({ visible: false, message: "", type: "" });
  };

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
<<<<<<< HEAD

      {/* Display Popup when there's a failure */}
      {popup.visible && (
        <Popup message={popup.message} type={popup.type} onClose={closePopup} />
=======
      {popup.visible && (
        <Popup
          message={popup.message}
          type={popup.type}
          onClose={handleClosePopup}
        />
>>>>>>> 212ffda8ca201a78847554a304caa91e4f4963d5
      )}
    </div>
  );
};

export default Login;

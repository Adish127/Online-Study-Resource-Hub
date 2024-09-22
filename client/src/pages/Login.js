import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserProfile, setLoading, setError } from "../features/userSlice";
import { fetchUserProfile } from "../api/apiServices";
import Popup from "../components/Popup"; // Popup
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [popup, setPopup] = useState({ visible: false, message: "", type: "" });

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5001/api/auth/google";
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
          navigate("/login");
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
      {popup.visible && (
        <Popup
          message={popup.message}
          type={popup.type}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
};

export default Login;

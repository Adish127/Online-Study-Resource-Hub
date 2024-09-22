import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserProfile, setLoading, setError } from "../features/userSlice";
import { fetchUserProfile } from "../api/apiServices"; // Import your API service directly

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Use this to get the tokens from URL params
  const dispatch = useDispatch();

  const handleGoogleLogin = () => {
    // Redirect to your backend Google OAuth endpoint
    window.location.href = "http://localhost:5001/api/auth/google";
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
          // console.error("Error fetching profile data:", err);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          navigate("/login");
        });
    }
  }, [dispatch, navigate, location.search]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1>Login</h1>
        <p>Welcome! Please login using your Google account.</p>
        <button
          onClick={handleGoogleLogin}
          style={{ padding: "10px 20px", fontSize: "16px" }}
        >
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default Login;

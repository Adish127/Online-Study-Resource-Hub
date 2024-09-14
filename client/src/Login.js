import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchUserProfile } from "./api/apiServices"; // Direct API service import
import { setUserProfile, setLoading, setError } from "./features/userSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGoogleLogin = () => {
    // Redirect to your backend Google OAuth endpoint
    window.location.href = "http://localhost:5001/api/auth/google";
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      dispatch(setLoading("loading"));
      fetchUserProfile(token)
        .then((response) => {
          dispatch(setUserProfile(response));
          dispatch(setLoading("succeeded"));
          navigate("/dashboard");
        })
        .catch((err) => {
          dispatch(setError("Error fetching profile data."));
          dispatch(setLoading("failed"));
          console.error("Error fetching profile data:", err);
        });
    }
  }, [dispatch, navigate]);

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

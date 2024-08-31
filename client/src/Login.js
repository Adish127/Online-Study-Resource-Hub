import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  // useEffect(() => {
  //   // Check if the token is available in the cookies
  //   const token = getCookie("token");
  //   console.log(token);

  //   if (token) {
  //     // If token is found, store it in localStorage and redirect to dashboard
  //     localStorage.setItem("token", token);
  //     navigate("/dashboard");
  //   }
  // }, [navigate]);

  const handleGoogleLogin = () => {
    // Redirect to your backend Google OAuth endpoint
    window.location.href = "http://localhost:5001/api/auth/google";
  };

  // Function to extract a specific cookie by name
  const getCookie = (name) => {
    return document.cookie;
  };

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

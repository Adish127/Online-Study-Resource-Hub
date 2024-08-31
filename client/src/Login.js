import React from "react";

const Login = () => {
  const handleGoogleLogin = () => {
    // Redirect to your backend Google OAuth endpoint
    window.location.href = "http://localhost:5001/api/auth/google";
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

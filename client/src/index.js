// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";

import Login from "./Login";
import Dashboard from "./Dashboard"; // Import your Dashboard component
import CompleteRegistration from "./CompleteRegistration";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <GoogleOAuthProvider
    clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID.toString()}
  >
    <React.StrictMode>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/profile-completion"
            element={<CompleteRegistration />}
          />
        </Routes>
      </Router>
    </React.StrictMode>
  </GoogleOAuthProvider>
);

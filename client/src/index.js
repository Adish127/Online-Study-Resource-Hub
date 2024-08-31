// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";

import Login from "./Login";
import Dashboard from "./Dashboard"; // Import your Dashboard component

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <GoogleOAuthProvider clientId="178224198268-iu7k5s4e9ks7t5r09tofphatteas4q4h.apps.googleusercontent.com">
    <React.StrictMode>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </React.StrictMode>
  </GoogleOAuthProvider>
);

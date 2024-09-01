// index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Login from "./Login";
import CompleteRegistration from "./CompleteRegistration";
import store from "./app/store";
import Resources from "./Resources";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/profile-completion"
            element={<CompleteRegistration />}
          />
          <Route path="/resources" element={<Resources />} />
        </Routes>
      </Router>
    </Provider>
  </React.StrictMode>
);

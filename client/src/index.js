import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Login from "./Login";
import CompleteRegistration from "./CompleteRegistration";
// import Resources from "./Resources";
import UploadResource from "./UploadResource";
import MyResources from "./MyResources";
import store from "./app/store";
import { fetchUserProfile } from "./api/apiServices"; // Import your API service directly
import { setUserProfile, setLoading, setError } from "./features/userSlice";
import BrowseResources from "./BrowseResources";

const root = ReactDOM.createRoot(document.getElementById("root"));

const token = localStorage.getItem("token");

if (token) {
  store.dispatch(setLoading("loading")); // Set status to loading
  fetchUserProfile(token)
    .then((response) => {
      store.dispatch(setUserProfile(response));
      store.dispatch(setLoading("succeeded")); // Set status to succeeded
    })
    .catch((err) => {
      store.dispatch(setError("Failed to fetch user profile."));
      store.dispatch(setLoading("failed")); // Set status to failed
      console.error("Error fetching profile data:", err);
    });
}

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
          <Route path="/resources" element={<MyResources />} />
          <Route path="/resources/upload" element={<UploadResource />} />
          <Route path="/resources/browse" element={<BrowseResources />} />
        </Routes>
      </Router>
    </Provider>
  </React.StrictMode>
);

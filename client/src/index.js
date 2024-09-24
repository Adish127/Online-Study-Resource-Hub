import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./app/store";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import CompleteRegistration from "./pages/CompleteRegistration";
import { fetchUserProfile } from "./api/apiServices"; // Import your API service directly
import { setUserProfile, setLoading, setError } from "./features/userSlice";

import Resources from "./pages/Resources";
import ViewResource from "./pages/ViewResource";
import UploadResource from "./pages/UploadResource";
import MyUploads from "./pages/MyUploads";
import RecentActivities from "./pages/RecentActivities";

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
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <Routes>
            {/* When other routes, redirect to /login */}
            <Route path="/*" element={<Navigate to={"/login"} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/profile-completion"
              element={<CompleteRegistration />}
            />
            <Route path="/resources" element={<Resources />} />
            <Route
              path="/resources/view/:resourceId"
              element={<ViewResource />}
            />
            <Route path="/resources/upload" element={<UploadResource />} />
            <Route path="/my-uploads" element={<MyUploads />} />
            <Route path="/recent-activities" element={<RecentActivities />} />
          </Routes>
        </Router>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

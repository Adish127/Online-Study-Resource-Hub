import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUserProfile } from "./features/userSlice";
import { fetchUserProfile } from "./api/apiServices";

const Dashboard = () => {
  const dispatch = useDispatch();
  const userProfile = useSelector((state) => state.user.profile); // Select user profile from the Redux store
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        // console.log("params", params);
        const token = params.get("token") || localStorage.getItem("token");
        localStorage.setItem("token", token);

        if (!token) {
          console.log("No token found");
          navigate("/login");
          return;
        }

        const userProfileData = await fetchUserProfile(token);
        dispatch(setUserProfile(userProfileData)); // Dispatch action to store profile in Redux

        if (!userProfileData.isProfileComplete) {
          console.log("Profile is not complete", userProfileData);
          navigate("/profile-completion"); // Redirect if profile is not complete
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        navigate("/login"); // Redirect to login on error
      }
    };

    fetchData();
  }, [dispatch, navigate]);

  return (
    <div>
      <h1>Dashboard</h1>
      {userProfile ? (
        <div>
          <p>Welcome, {userProfile.email}!</p>
          <p>Here is your profile:</p>
          <pre>{JSON.stringify(userProfile, null, 2)}</pre>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;

import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUserProfile, setLoading, setError } from "./features/userSlice";
import { fetchUserProfile } from "./api/apiServices"; // Import your API service directly
import "./Dashboard.css"; // Import your custom CSS

const Dashboard = () => {
  const dispatch = useDispatch();
  const userProfile = useSelector((state) => state.user.profile);
  const userStatus = useSelector((state) => state.user.status); // Check loading or error status
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    // Fetch profile directly if not available
    if (!userProfile && userStatus === "idle") {
      dispatch(setLoading("loading")); // Set status to loading
      fetchUserProfile(token)
        .then((response) => {
          dispatch(setUserProfile(response));
          dispatch(setLoading("succeeded")); // Set status to succeeded
        })
        .catch((err) => {
          dispatch(setError("Failed to fetch user profile."));
          dispatch(setLoading("failed")); // Set status to failed
        });
    }
  }, [dispatch, navigate, userProfile, userStatus]);

  useEffect(() => {
    // Redirect if profile is not complete
    if (userProfile && !userProfile.isProfileComplete) {
      navigate("/profile-completion");
    }
  }, [userProfile, navigate]);

  if (userStatus === "loading") {
    return <div>Loading...</div>;
  }

  if (userStatus === "failed") {
    return <div>Error loading profile.</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="header">
        <div className="logo">Resource Hub</div>
        <div className="user-info">
          {userProfile && (
            <>
              <Link to="/profile-completion">
                <img
                  src={userProfile.profilePicture}
                  alt="Profile"
                  className="profile-picture-small"
                />
              </Link>
              <span className="user-name">{userProfile.name}</span>
            </>
          )}
        </div>
      </header>

      <div className="main-container">
        <aside className="sidebar">
          <nav>
            <Link to="/dashboard" className="nav-link">
              Dashboard
            </Link>
            <Link to="/resources" className="nav-link">
              My Resources
            </Link>
            <Link to="/study-groups" className="nav-link">
              Study Groups
            </Link>
            <Link to="/notifications" className="nav-link">
              Notifications
            </Link>
            <Link to="/interests" className="nav-link">
              Interests
            </Link>
          </nav>
        </aside>

        <main className="main-content">
          <section className="welcome-section">
            <h1>Welcome, {userProfile?.name}!</h1>
            <p>
              Here you can manage your resources, view study groups, and more.
            </p>
          </section>

          <section className="quick-stats">
            <div className="stat-item">
              <h2>Resources</h2>
              <p>Manage your resources here.</p>
            </div>
            <div className="stat-item">
              <h2>Study Groups</h2>
              <p>Join or create study groups.</p>
            </div>
            <div className="stat-item">
              <h2>Notifications</h2>
              <p>Check your recent notifications.</p>
            </div>
          </section>

          <section className="recent-activities">
            <h2>Recent Activities</h2>
            {/* Feed of recent activities */}
          </section>
        </main>
      </div>

      <footer className="footer">
        <p>&copy; 2024 Resource Hub. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Dashboard;

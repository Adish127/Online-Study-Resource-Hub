import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBell } from "react-icons/fa"; // Importing bell icon
import "./Header.css";

const Header = ({ userProfile, notifications }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <header className="header">
      <div className="logo">Resource Hub</div>
      <div className="header-right">
        <div className="notification-container">
          <FaBell className="notification-icon" onClick={toggleNotifications} />
          {showNotifications && (
            <div className="notification-popup">
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <div key={index} className="notification-item">
                    {notification}
                  </div>
                ))
              ) : (
                <div className="notification-item">No new notifications</div>
              )}
            </div>
          )}
        </div>
        <div className="user-info">
          {userProfile && (
            <Link to="/profile-completion" className="profile-link">
              <img
                src={userProfile.profilePicture}
                alt="Profile"
                className="profile-picture-small"
              />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

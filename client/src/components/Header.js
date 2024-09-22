import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBell } from "react-icons/fa"; // Importing bell icon
import { FaDoorOpen } from "react-icons/fa"; // Importing door icon for logout
import "./Header.css";

const Header = ({ userProfile, notifications, onLogout }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // State to control profile options popup

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
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
        <div className="user-info" onClick={togglePopup}>
          {userProfile && (
            <img
              src={userProfile.profilePicture}
              alt="Profile"
              className="profile-picture-small"
            />
          )}
        </div>
      </div>

      {showPopup && (
        <div className="profile-popup">
          <Link to="/profile-completion" className="profile-option">
            Profile
          </Link>
          <div className="profile-option" onClick={onLogout}>
            Logout <FaDoorOpen className="logout-icon" />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

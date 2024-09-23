import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBell,
  FaCaretDown,
  FaSearch,
  FaUser,
  FaDoorOpen,
} from "react-icons/fa";
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

      <div className="header-left">
        <input type="text" placeholder="Search" className="search-bar" />
        <FaSearch className="search-icon" />
      </div>

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
            <>
              <img
                src={userProfile.profilePicture}
                alt="Profile"
                className="profile-picture-small"
              />
              {/* A dropdown when clicking user name along with icon*/}
              <div className="user-name-dropdown" onClick={togglePopup}>
                <span className="user-name">{userProfile.name}</span>
                <FaCaretDown className="dropdown-icon" />
              </div>
            </>
          )}
        </div>
      </div>

      {showPopup && (
        <div className="profile-popup">
          <Link to="/profile-completion" className="profile-option">
            Profile <FaUser className="profile-icon" />
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

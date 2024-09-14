import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = ({ userProfile }) => {
  return (
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
  );
};

export default Header;

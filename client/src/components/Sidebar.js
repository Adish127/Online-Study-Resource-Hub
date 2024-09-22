import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  return (
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
  );
};

export default Sidebar;

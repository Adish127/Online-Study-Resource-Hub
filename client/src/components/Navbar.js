import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaBook, FaClock, FaSearch } from "react-icons/fa"; // Icons
import "./Navbar.css";

const Navbar = () => {
  return (
    <aside className="navbar">
      <nav>
        <Link to="/dashboard" className="nav-link">
          <FaHome className="nav-icon" />
          <span>Dashboard</span>
        </Link>
        {/* <Link to="/resources" className="nav-link">
          <FaBook className="nav-icon" />
          <span>My Resources</span>
        </Link> */}
        <Link to="/resources" className="nav-link">
          <FaSearch className="nav-icon" />
          <span>Browse Resources</span>
        </Link>
        <Link to="/recent-activities" className="nav-link">
          <FaClock className="nav-icon" />
          <span>Recent Activities</span>
        </Link>
      </nav>

      {/* Optional Footer for Sidebar */}
      <div className="navbar-footer">
        <span>&copy; 2024 Resource Hub</span>
      </div>
    </aside>
  );
};

export default Navbar;

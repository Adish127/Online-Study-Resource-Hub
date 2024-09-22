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
          Dashboard
        </Link>
        <Link to="/resources" className="nav-link">
          <FaBook className="nav-icon" />
          My Resources
        </Link>
        <Link to="/browse-resources" className="nav-link">
          <FaSearch className="nav-icon" />
          Browse Resources
        </Link>
        <Link to="/recent-activities" className="nav-link">
          <FaClock className="nav-icon" />
          Recent Activities
        </Link>
      </nav>
    </aside>
  );
};

export default Navbar;

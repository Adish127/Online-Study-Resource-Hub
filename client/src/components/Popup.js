import React from "react";
import "./Popup.css";

<<<<<<< HEAD
const Popup = ({ message, type, onClose }) => {
  // Determine the background color and loading bar color based on the type
  const loadingBarColor =
    type === "success" ? "green" : type === "failure" ? "red" : "yellow";

  return (
    <div className="popup">
      <button
        className="popup-close-button"
        onClick={onClose}
        style={{ color: "black" }}
      >
        &times;
      </button>
      <div className="popup-message">{message}</div>
      <div className="loading-bar-container">
        <div
          className="loading-bar"
          style={{ backgroundColor: loadingBarColor }}
        />
=======
const Popup = ({ message, onClose }) => {
  return (
    <div className="popup-container">
      <div className="popup">
        <span className="popup-message">{message}</span>
        <span className="close-icon" onClick={onClose}>
          ✖
        </span>
>>>>>>> 212ffda8ca201a78847554a304caa91e4f4963d5
      </div>
    </div>
  );
};

export default Popup;

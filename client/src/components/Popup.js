import React from "react";
import "./Popup.css";

const Popup = ({ message, onClose }) => {
  return (
    <div className="popup-container">
      <div className="popup">
        <span className="popup-message">{message}</span>
        <span className="close-icon" onClick={onClose}>
          ✖
        </span>
      </div>
    </div>
  );
};

export default Popup;

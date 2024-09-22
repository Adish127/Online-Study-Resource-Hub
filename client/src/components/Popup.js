import React, { useEffect, useState } from "react";
import "./Popup.css"; // Make sure to include the CSS file

const Popup = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, 5000); // Hide after 5 seconds

    return () => clearTimeout(timer); // Clean up timer on unmount
  }, [onClose]);

  if (!visible) return null;

  return (
    <div className={`popup ${type}`}>
      <span>{message}</span>
      <button
        className="close-btn"
        onClick={() => {
          setVisible(false);
          onClose();
        }}
      >
        ✕
      </button>
    </div>
  );
};

export default Popup;

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../features/themeSlice";

const Settings = () => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  const handleToggleTheme = () => {
    console.log("Before dispatching", isDarkMode);
    dispatch(toggleTheme(!isDarkMode)); // Dispatches the action to toggle the theme
  };

  // Logs the updated state after the component re-renders
  useEffect(() => {
    console.log("After dispatching", isDarkMode);
  }, [isDarkMode]);

  return (
    <div>
      <button onClick={handleToggleTheme}>
        Toggle Theme: {isDarkMode ? "Dark Mode" : "Light Mode"}
      </button>
    </div>
  );
};

export default Settings;

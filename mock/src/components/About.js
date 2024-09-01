import React from "react";
import { useSelector } from "react-redux";

function About() {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  return (
    <div className={`about ${isDarkMode ? "dark" : "light"}`}>
      <h1>About Page</h1>
      <p>Learn more about this app on this page.</p>
    </div>
  );
}

export default About;

import React from "react";
import { useSelector } from "react-redux";

function Home() {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  return (
    <div className={`home ${isDarkMode ? "dark" : "light"}`}>
      <h1>Home Page</h1>
      <p>Welcome to the home page!</p>
    </div>
  );
}

export default Home;

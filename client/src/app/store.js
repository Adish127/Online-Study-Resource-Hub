// src/store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice"; // Adjust the path as needed
import resourceReducer from "../features/resourceSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    resource: resourceReducer, // Add the resourceReducer here
  },
  // No need to add middleware manually for redux-thunk as it is included by default
});

export default store;

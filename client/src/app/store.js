// src/store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice"; // Adjust the path as needed

const store = configureStore({
  reducer: {
    user: userReducer,
  },
  // No need to add middleware manually for redux-thunk as it is included by default
});

export default store;

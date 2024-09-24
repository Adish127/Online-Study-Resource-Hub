// src/features/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profile: null, // Ensure the profile is null initially
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserProfile(state, action) {
      state.profile = action.payload;
    },
    setLoading(state, action) {
      state.status = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setUserProfile, setLoading, setError } = userSlice.actions;

export default userSlice.reducer;

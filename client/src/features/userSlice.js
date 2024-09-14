// features/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    profile: null,
    status: "idle", // You can keep this if you want to track status manually
    error: null,
  },
  reducers: {
    setUserProfile: (state, action) => {
      state.profile = action.payload;
    },
    setLoading: (state, action) => {
      state.status = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setUserProfile, setLoading, setError } = userSlice.actions;
export default userSlice.reducer;

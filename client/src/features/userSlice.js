// features/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    profile: null,
  },
  reducers: {
    setUserProfile: (state, action) => {
      state.profile = action.payload;
    },
    // Other reducers if needed
  },
});

export const { setUserProfile } = userSlice.actions;
export default userSlice.reducer;

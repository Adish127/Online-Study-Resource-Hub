// features/popupsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const popupsSlice = createSlice({
  name: "popups",
  initialState: {
    message: "",
    type: "", // 'success' or 'error'
  },
  reducers: {
    setPopup: (state, action) => {
      state.message = action.payload.message;
      state.type = action.payload.type;
    },
    clearPopup: (state) => {
      state.message = "";
      state.type = "";
    },
  },
});

export const { setPopup, clearPopup } = popupsSlice.actions;
export default popupsSlice.reducer;

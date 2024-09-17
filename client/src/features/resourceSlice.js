import { createSlice } from "@reduxjs/toolkit";

const resourceSlice = createSlice({
  name: "resource",
  initialState: {
    resources: [], // Array to store multiple resources
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null, // To store any error encountered during the process
  },
  reducers: {
    setResources: (state, action) => {
      state.resources = action.payload; // Store all uploaded resources
    },
    addResource: (state, action) => {
      state.resources.push(action.payload); // Add a single resource to the list
    },
    setLoading: (state, action) => {
      state.status = action.payload; // Update the loading status
    },
    setError: (state, action) => {
      state.error = action.payload; // Set any error encountered
    },
  },
});

export const { setResources, addResource, setLoading, setError } =
  resourceSlice.actions;
export default resourceSlice.reducer;

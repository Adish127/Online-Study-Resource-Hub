// src/store.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // Default: localStorage for web
import userReducer from "../features/userSlice";
import resourceReducer from "../features/resourceSlice";

const persistConfig = {
  key: "root", // Key for the persisted storage in localStorage
  storage, // Using localStorage
  whitelist: ["resource"], // Persist both user and resource slices
};

const rootReducer = combineReducers({
  user: userReducer,
  resource: resourceReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

const persistor = persistStore(store);

export { store, persistor };

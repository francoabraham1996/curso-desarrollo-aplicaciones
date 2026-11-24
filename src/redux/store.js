
import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "./taskSlice";
import profileReducer from "./profileSlice";

export const store = configureStore({
  reducer: {
    tasks: taskReducer,
    profile: profileReducer,
  },
});

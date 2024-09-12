import { configureStore } from "@reduxjs/toolkit";
import tasksSlice from "./Slices/tasksSlice";

export const store = configureStore({
  reducer: {
    task: tasksSlice,
  },
});

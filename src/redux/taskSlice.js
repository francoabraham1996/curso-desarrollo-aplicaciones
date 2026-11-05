
import { createSlice } from "@reduxjs/toolkit";

const taskSlice = createSlice({
  name: "tasks",

  initialState: {
    items: [],
    filter: "all",
  },

  reducers: {
    addTask: (state, action) => {
      state.items.push({
        ...action.payload,
        id: Date.now().toString(),
        completed: false,
      });
    },

    toggleTaskStatus: (state, action) => {
      const task = state.items.find(
        (item) => item.id === action.payload
      );

      if (task) {
        task.completed = !task.completed;
      }
    },

    deleteTask: (state, action) => {
      state.items = state.items.filter(
        (item) => item.id !== action.payload
      );
    },

    setFilter: (state, action) => {
      state.filter = action.payload;
    },
  },
});

export const {
  addTask,
  toggleTaskStatus,
  deleteTask,
  setFilter,
} = taskSlice.actions;

export default taskSlice.reducer;


import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],
    filter: "all",
    loading: true,
    error: null,
    fromCache: false,
    hasPendingWrites: false,
};

const taskSlice = createSlice({
    name: "tasks",
    initialState,

    reducers: {
        addTask: (state, action) => {
            state.items.push({
                ...action.payload,
                id: action.payload.id || Date.now().toString(),
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

        setTasks: (state, action) => {
            state.items = action.payload;
        },

        clearTasks: () => ({
            ...initialState,
            items: [],
        }),

        setFilter: (state, action) => {
            state.filter = action.payload;
        },

        setTasksLoading: (state, action) => {
            state.loading = action.payload;
        },

        setTasksError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },

        setTasksSync: (state, action) => {
            state.items = action.payload.tasks;
            state.fromCache = action.payload.fromCache;
            state.hasPendingWrites =
                action.payload.hasPendingWrites;

            state.loading = false;
            state.error = null;
        },
    },
});

export const {
    addTask,
    toggleTaskStatus,
    deleteTask,
    setFilter,
    setTasks,
    clearTasks,
    setTasksLoading,
    setTasksError,
    setTasksSync,
} = taskSlice.actions;

export default taskSlice.reducer;

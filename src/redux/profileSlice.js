
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    uid: null,
    name: "",
    email: "",
    avatar: null,
};

const profileSlice = createSlice({
    name: "profile",
    initialState,

    reducers: {
        setProfile: (state, action) => {
            state.uid = action.payload.uid;
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.avatar = action.payload.avatar || null;
        },

        setAvatar: (state, action) => {
            if (state.uid === action.payload.uid) {
                state.avatar = action.payload.avatar;
            }
        },

        clearProfile: () => initialState,
    },
});

export const {
    setProfile,
    setAvatar,
    clearProfile,
} = profileSlice.actions;

export default profileSlice.reducer;

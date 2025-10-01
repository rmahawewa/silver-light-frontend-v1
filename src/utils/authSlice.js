// src/store/authSlice.js

import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
	name: "auth",
	initialState: {
		isLoggedIn: false, // Default state
		user: null, // To store user data
	},
	reducers: {
		login: (state, action) => {
			state.isLoggedIn = true;
			state.user = action.payload; // Store the user data
		},
		logout: (state) => {
			state.isLoggedIn = false;
			state.user = null; // Clear user data on logout
		},
		changePhotoUrl: (state, action) => {
			state.user.photoUrl = action.payload;
		},
	},
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
	name: "notificationfeed",
	initialState: null,
	reducers: {
		addNotifications: (state, action) => {
			return [action.payload];
		},
		addOneNotification: (state, action) => {
			// Correct way: Return the new array
			// Check if state is null and handle it, otherwise add the new item
			if (state === null) {
				return [action.payload];
			}
			return [...state, action.payload];
		},
		addInitiallyFromDB: (state, action) => {
			return action.payload;
		},
		removeNotification: (state, action) => {
			return null;
		},
		rearrangeNotification: (state, action) => {
			state = action.payload;
			return state;
		},
	},
});

export const {
	addNotifications,
	addOneNotification,
	addInitiallyFromDB,
	removeNotification,
	rearrangeNotification,
} = notificationSlice.actions;

export default notificationSlice.reducer;

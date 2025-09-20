import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
	name: "notificationfeed",
	initialState: [],
	reducers: {
		addNotifications: (state, action) => {
			return action.payload;
		},
		addOneNotification: (state, action) => {
			// Correct way: Return the new array
			// Check if state is null and handle it, otherwise add the new item
			if (state === null) {
				return [action.payload];
			}
			return [...state, action.payload];
		},
	},
});

export const { addNotifications, addOneNotification } =
	notificationSlice.actions;

export default notificationSlice.reducer;

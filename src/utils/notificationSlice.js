import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
	name: "notificationfeed",
	initialState: null,
	reducers: {
		addNotifications: (state, action) => {
			return action.payload;
		},
		addOneNotification: (state, action) => {
			state = [...state, action.payload];
			return state;
		},
	},
});

export const { addNotifications, addOneNotification } =
	notificationSlice.actions;

export default notificationSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const connectionRequestSlice = createSlice({
	name: "connectionfeed",
	initialState: [],
	reducers: {
		addConnectionFeed: (state, action) => {
			return action.payload;
		},
		addNewConnectionRequest: (state, action) => {
			// if (state.length === 0) {
			// 	return action.payload;
			// } else {
			// 	// state.push(action.payload);
			// 	// return state;
			// 	state = [...state, action.payload];
			// 	return state;
			// }
			return [...state, action.payload];
		},
		saveRespond: (state, action) => {
			const request = action.payload;
			const entry = state.find((r) => r._id === request._id);
			if (!entry) {
				console.warn(`Connection request with ${request._id} not found.`);
			}
			entry.status = request.status;
		},
		removeConnections: (state, action) => {
			return null;
		},
	},
});

export const {
	addConnectionFeed,
	addNewConnectionRequest,
	saveRespond,
	removeConnections,
} = connectionRequestSlice.actions;
export default connectionRequestSlice.reducer;

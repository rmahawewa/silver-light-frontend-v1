import { createSlice } from "@reduxjs/toolkit";

const imageSlice = createSlice({
	name: "imagefeed",
	initialState: null,
	reducers: {
		addImageFeed: (state, action) => {
			return action.payload;
		},
		savereaction: (state, action) => {
			const reaction = action.payload;
			console.log(reaction);
			const photo = state.find((photo) => photo?._id === reaction?.photoId);
			if (!photo) {
				console.warn(
					`Image with ${reaction.photoId} not found. Cannot save reaction`
				);
				return;
			}
			if (!photo.reactions) {
				photo.reactions = [];
			}
			const existingReactionIndex = photo.reactions.findIndex(
				(r) => r._id === reaction._id
			);
			if (existingReactionIndex >= 0) {
				photo.reactions[existingReactionIndex] = {
					_id: reaction._id,
					reactionType: reaction.reactionType,
					reactedById: reaction.reactedById,
				};
			} else {
				photo.reactions.push({
					_id: reaction._id,
					reactionType: reaction.reactionType,
					reactedById: reaction.reactedById,
				});
			}
		},
		addoneimage: (state, action) => {
			state = [...state, action.payload];
			return state;
		},
		removeImage: (state, action) => {
			return null;
		},
	},
});

export const { addImageFeed, savereaction, addoneimage, removeImage } =
	imageSlice.actions;
export default imageSlice.reducer;

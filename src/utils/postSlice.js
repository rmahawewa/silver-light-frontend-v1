import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
	name: "postfeed",
	initialState: null,
	reducers: {
		addPostFeed: (state, action) => {
			return action.payload;
		},
		addOnePost: (state, action) => {
			state = [...state, action.payload];
			return state;
		},
		savepostreaction: (state, action) => {
			const reaction = action.payload;
			console.log(reaction);
			const post = state.find((post) => post._id === reaction.postId);
			if (!post) {
				console.warn(
					`Image with ${reaction.postId} not found. Cannot save reaction`
				);
				return;
			}
			if (!post.post_reactions) {
				post.post_reactions = [];
			}
			const existingReactionIndex = post.post_reactions.findIndex(
				(r) => r._id === reaction._id
			);
			if (existingReactionIndex >= 0) {
				post.post_reactions[existingReactionIndex] = {
					_id: reaction._id,
					reactionType: reaction.reactionType,
					reactedById: reaction.reactedById,
				};
			} else {
				post.post_reactions.push({
					_id: reaction._id,
					reactionType: reaction.reactionType,
					reactedById: reaction.reactedById,
				});
			}
		},
	},
});

export const { addPostFeed, addOnePost, savepostreaction } = postSlice.actions;
export default postSlice.reducer;

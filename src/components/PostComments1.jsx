import React from "react";

const PostComments = (comments) => {
	console.log(comments.comments);
	const commentsArr = comments.comments;
	const rootComments =
		commentsArr.length > 0 &&
		commentsArr.filter((c) => c.parentCommentId === null).map((c) => c._id);
	console.log(rootComments);

	return rootComments.length > 0 ? (
		<>
			<ol>
				{rootComments.map((id) => (
					<CommentTree key={id} commentId={id} comments={commentsArr} />
				))}
			</ol>
		</>
	) : (
		<div>No comments yet</div>
	);
};

const CommentTree = ({ commentId, comments }) => {
	const currentComment = comments.find((c) => c._id === commentId);
	const childCommentIds = currentComment.childCommentIds;

	return (
		<li>
			{currentComment.comment}
			{childCommentIds.length > 0 && (
				<ol>
					{childCommentIds.map((childId) => (
						<CommentTree
							key={childId}
							commentId={childId}
							comments={comments}
						/>
					))}
				</ol>
			)}
			<input type="text" placeholder="Small" className="input input-sm" />
		</li>
	);
};

export default PostComments;

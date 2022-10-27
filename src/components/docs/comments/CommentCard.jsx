function CommentCard({ comment, index }) {
    const commentStyle = {
        backgroundColor: "#cccc",
        boxShadow: '3px 5px 9px' + comment.color,
    };

    return (
        <div className="comment">
            <p style={commentStyle}>{comment.comment}</p>
            <p>
                Written by: <br />
                {comment.user}
            </p>
        </div>
    );
}

export default CommentCard;

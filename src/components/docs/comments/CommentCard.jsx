function CommentCard({ comment, index }) {
    return (
        <div className="comment">
            <p>
                {comment.comment}
            </p>
            {/* <p>
                Position: <br />
                {comment.range.index} - {comment.range.length}
            </p> */}
            <p>
                Written by: <br />
                {comment.user}
            </p>
        </div>
    );
}

export default CommentCard;

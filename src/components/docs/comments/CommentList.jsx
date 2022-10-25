
function CommentList({ docs }) {
    console.log("CommentList:", typeof docs.comments);

    const commentCard = Object.entries(docs.comments).map(([key, comment]) => {
        console.log("CommentList:", comment);
        return (
            <div className="comment">
                <p>
                    Comment: <br />
                    {comment.comment}</p>
                <p>
                    Position:  <br />
                    {comment.range.index} - {comment.range.length}</p>
                <p>
                    Written by:  <br />
                    {comment.user}</p>
            </div>
        );
    });
    return <div>{commentCard}</div>;
}

export default CommentList;

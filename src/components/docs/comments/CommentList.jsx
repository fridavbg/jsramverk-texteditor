
function CommentList({ docs }) {
    console.log("CommentList:", typeof docs.comments);

    const commentCard = Object.entries(docs.comments).map(([key, comment]) => {
        console.log("CommentList:", comment);
        return (
            <div className="comment">
                <p>{comment.comment}</p>
                <p>Index: {comment.range.index}</p>
                <p>Length: {comment.range.length}</p>
                <p>Written by: {comment.user}</p>
            </div>
        );
    });
    return <div>{commentCard}</div>;
}

export default CommentList;

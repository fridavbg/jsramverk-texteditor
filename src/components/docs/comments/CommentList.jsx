import CommentCard from "./CommentCard";

function CommentList({ doc, editorRef }) {
    // const editor = editorRef.current.editor;

    // editor.formatText(comment.range.index, comment.range.length, 'background', color);
    let commentCard = [];

    if (doc) {
        commentCard = Object.entries(doc.comments).map(([key, comment]) => {
            return (
                <CommentCard
                    key={key}
                    comment={comment}
                />
            );
        });
    }

    if (commentCard.length > 0) {
        return <div className="list">{commentCard}</div>;
    } else {
        return <p className="notification">There are no comments in this document at the moment</p>;
    }
}

export default CommentList;

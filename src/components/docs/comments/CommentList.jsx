import Delta from "react-quill";

import CommentCard from "./CommentCard";

function CommentList({ doc, editorRef }) {
    let editor;
    if (editorRef.current !== undefined) {
        editor = editorRef.current.editor;
    }
    let commentCard = [];

    if (doc) {
        commentCard = Object.entries(doc.comments).map(([key, comment]) => {
            if (editor !== undefined) {
                editor.formatText(comment.range.index, comment.range.length, 'background', comment.color);
            }
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

import { useState } from "react";

function CommentBox({ addCommentToDoc, editorRef, setShowCommentBox, showCommentBox }) {
    const unprivilegedEditor = editorRef.current.unprivilegedEditor;
    const [newComment, setNewComment] = useState({
        comment: "",
        user: "fperssontech@gmail.com",
        range: {}
    });
    let newObject = {};

    function changeComment(event) {
        newObject["comment"] = event.target.value;
        setNewComment({...newComment, ...newObject });
    }

    async function addComment(event) {
        event.preventDefault();
        let range = unprivilegedEditor.getSelection();
        if (range === null || newComment.comment === "") {
            alert("Did you forget to mark some text or add some text for the comment?");
        } else {
            newComment["range"] = range;
            // console.log("CommentBox:", newComment);
            addCommentToDoc(newComment);
            setShowCommentBox(!showCommentBox);
        }
    };

    return (
        <>
            <form className="comment-form">
            <h3>Add your comment and mark some text in the editor</h3>
                <label
                    className="label">Comment:</label>
                    <input type="comment" text="comment" name="comment" onChange={changeComment}
                    required />
                    <button className="send-btn" onClick={addComment} >Submit comment</button>
            </form>
        </>
    )
}

export default CommentBox;

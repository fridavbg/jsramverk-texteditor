import { useState } from "react";

import useGenerateRandomColor 
    from "./useGenerateRandomColor";

function CommentBox({ addCommentToDoc, editorRef, setShowCommentBox, showCommentBox, user }) {
    
    const unprivilegedEditor = editorRef.current.unprivilegedEditor;
    const [newComment, setNewComment] = useState({
        comment: "",
        user: user.email,
        range: {},
        color: ""
    });
    let newObject = {};
    const { color, generateColor } 
    = useGenerateRandomColor();


    function changeComment(event) {
        newObject["comment"] = event.target.value;
        setNewComment({...newComment, ...newObject });
    }

    async function addComment(event) {
        event.preventDefault();
        generateColor();
        let range = unprivilegedEditor.getSelection();
        
        if (range === null || newComment.comment === "") {
            alert("Did you forget to mark some text or add some text for the comment?");
        } else {
            newComment["range"] = range;
            newComment["color"] = color;
            addCommentToDoc(newComment);
            setShowCommentBox(!showCommentBox);
        }
    };

    return (
        <>
            <form className="comment-form">
            <h3>Add your comment and mark some text in the editor</h3>
                    <input type="comment" text="comment" name="comment" onChange={changeComment}
                    required />
                    <button className="btn" onClick={addComment} >Submit comment</button>
            </form>
        </>
    )
}

export default CommentBox;

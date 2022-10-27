import { useState } from "react";

function CommentBox({ addCommentToDoc, editorRef, setShowCommentBox, showCommentBox, user }) {
    
    const unprivilegedEditor = editorRef.current.unprivilegedEditor;
    const [newComment, setNewComment] = useState({
        comment: "",
        user: user.email,
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

        var text = unprivilegedEditor.getText(range.index, range.length);
        
        console.log('User has highlighted', text);

        let delta = [{
            format: {
                index: range.index,
                length: range.length
            },
            attributes: {
                bold: true
            }
        }];
        
        console.log("CommentBox: ", delta);
        if (range === null || newComment.comment === "") {
            alert("Did you forget to mark some text or add some text for the comment?");
        } else {
            newComment["range"] = range;
            // console.log("CommentBox:", newComment);
            addCommentToDoc(delta, newComment);
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

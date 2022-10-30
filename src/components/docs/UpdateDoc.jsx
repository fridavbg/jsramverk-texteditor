import { useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { pdfExporter } from "quill-to-pdf";
import { saveAs } from "file-saver";
import { io } from "socket.io-client";
import docModel from "../../models/documents";
import CommentBox from "../docs/comments/CommentBox";
import CommentList from "../docs/comments/CommentList";

const modules = {
    toolbar: [
        ["bold", "italic", "underline", "strike"],
        ["blockquote", "code-block"],

        [{ header: 1 }, { header: 2 }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "sub" }, { script: "super" }],
        [{ indent: "-1" }, { indent: "+1" }],

        [{ color: [] }, { background: [] }],
        [{ font: [] }],
        [{ align: [] }],
        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        ["clean"],
    ],
};

function UpdateDoc({user}) {
    const location = useLocation();
    const navigate = useNavigate();
    const editorRef = useRef();

    const [newDoc, setNewDoc] = useState({
        _id: location.state.doc._id,
        title: location.state.doc.title,
        description: location.state.doc.description,
        comments: location.state.doc.comments,
    });
    const [comments, setComments] = useState(location.state.doc.comments);
    const [socket, setSocket] = useState(null);
    const [value, setValue] = useState(newDoc.description);
    const [showCommentBox, setShowCommentBox] = useState(false);

    let newObject = {};

    async function fetchComments() {
        let comments;
        
        if (typeof newDoc._id === 'string') {
            comments = await docModel.getComments(newDoc._id);
        };
        if (editorRef.current !== null) {
            let editor = editorRef.current.getEditor();

            Object.entries(comments).map(([key, comment]) => {
                editor.formatText(comment.range.index, comment.range.length, 'background', comment.color);
                return "";
            }); 
        };
        setComments(comments);
    }

    useEffect(() => {
        (async () => {
            await fetchComments();
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [comments]);

    useEffect(() => {
        if (socket) {
            // create room with ID
            socket.emit("create", newDoc._id);
            socket.on("update", function (data) {
                let newObject = {
                    _id: newDoc._id,
                    title: newDoc.title,
                    description: data.description,
                    comments: data.comments,
                };
                setNewDoc({ ...newDoc, ...newObject });

                setValue(data.description);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);

    useEffect(() => {
        setSocket(io(docModel.baseUrl));
        return () => {
            if (socket) {
                socket.disconnect();
                console.log("Disconnected");
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const commentInput = () => {
        setShowCommentBox(!showCommentBox);
    };
    
    function changeTitle(event) {
        newObject[event.target.name] = event.target.value;
        setNewDoc({ ...newDoc, ...newObject });
    }

    async function saveText() {
        if (
            newDoc.title === "" ||
            newDoc.title === undefined ||
            newDoc.description === undefined ||
            newDoc.description === "" ||
            newDoc.description.hasOwnProperty("key")
        ) {
            alert("Please fill in a title and a text");
            return;
        }

        await docModel.updateDoc(newDoc);
        navigate("/docs");
    }

    const updateState = (text) => {
        if (socket) {
            let updatedDoc = {
                _id: newDoc._id,
                description: text,
                comments: newDoc.comments,
            };
        
            console.log("send to socket", updatedDoc);
            console.log("comments", comments);
            socket.emit("update", updatedDoc);
            setValue(text);
            setNewDoc({ ...newDoc, ...updatedDoc });

        }
    };

    async function downloadPDF() {
        const delta = editorRef.current.editor.getContents();
        const blob = await pdfExporter.generatePdf(delta);
        saveAs(blob, `${newDoc.title}.pdf`);
    }

    const addComment = async (comment) => {
        let comments; 
        let newObject = {
            _id: newDoc._id,
            title: newDoc.title,
            description: newDoc.description,
            comments: [...newDoc.comments, comment],
        };
        console.log(newObject.comments);
        comments = newObject.comments;
        setComments(comments);
        console.log("comments", comments);
        setNewDoc({ ...newDoc, ...newObject });
        console.log("newDoc", newDoc);
        await docModel.updateDoc(newObject);
    };

    return (
        <>
            <div>
                <button className="create-btn" onClick={saveText}>
                    Update
                </button>
                <button className="create-btn" onClick={commentInput}>
                    Add a comment
                </button>
                <button className="btn" onClick={downloadPDF}>
                    Download as PDF
                </button>
            </div>
            <div>
                <input
                    value={newDoc.title}
                    className="title-input"
                    onChange={changeTitle}
                    name="title"
                />
                {showCommentBox && (
                    <CommentBox
                        editorRef={editorRef}
                        user={user}
                        setShowCommentBox={setShowCommentBox}
                        showCommentBox={showCommentBox}
                        addCommentToDoc={addComment}
                    />
                )}
                <div className="editor-comments-wrapper">
                <div className="editor-wrapper">
                    <ReactQuill
                        className="editor"
                        name="description"
                        theme="snow"
                        value={value}
                        onChange={updateState}
                        modules={modules}
                        style={{ height: "9in", margin: "1em", flex: "1" }}
                        ref={editorRef}
                    />
                </div>
                <div className="comments-wrapper">
                        <h3>Comments:</h3>
                        <CommentList comments={comments} />
                </div>
                </div>
            </div>
        </>
    );
}

export default UpdateDoc;

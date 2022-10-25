import { useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { pdfExporter } from "quill-to-pdf";
import { saveAs } from "file-saver";
import { io } from "socket.io-client";
import docModel from "../../models/documents";
import CommentBox from "../docs/CommentBox";

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

function UpdateDoc() {
    const location = useLocation();
    const navigate = useNavigate();

    const [newDoc, setNewDoc] = useState({
        _id: location.state.doc._id,
        title: location.state.doc.title,
        description: location.state.doc.description,
        comments: location.state.comments
    });

    const editorRef = useRef();
    const [socket, setSocket] = useState(null);
    const [value, setValue] = useState(newDoc.description);
    const [showCommentBox, setShowCommentBox] = useState(false);

    let newObject = {};

    const commentInput = () => {
        setShowCommentBox(!showCommentBox);
    };

    // create socket & clear
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

    useEffect(() => {
        if (socket) {
            // create room with ID
            socket.emit("create", newDoc._id);
            socket.on("update", function (data) {
                let newObject = {
                    _id: newDoc._id,
                    title: newDoc.title,
                    description: data.description,
                    comments: data.comments
                };
                setNewDoc({ ...newDoc, ...newObject });
                setValue(data.description);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);

    const updateState = (text) => {
        if (socket) {
            let updatedDoc = {
                _id: newDoc._id,
                description: text,
                comments: newDoc.comments
            };
            let newObject = {
                _id: newDoc._id,
                title: newDoc.title,
                description: text,
                comments: newDoc.comments
            };
            socket.emit("update", updatedDoc);
            setValue(text);
            setNewDoc({ ...newDoc, ...newObject });
        }
    };

    async function downloadPDF() {
        const delta = editorRef.current.editor.getContents();
        const blob = await pdfExporter.generatePdf(delta);
        saveAs(blob, `${newDoc.title}.pdf`);
    }

    const addComment = async (comment) => {
        // add the comment to the newDoc state, then...
        console.log("Comment to be added:", comment);
        setNewDoc(oldDoc => {
            return {
                ...oldDoc,
                comments: [
                    ...oldDoc.comments,
                    comment
                ]
            }
        })
        console.log("After newDoc addComment:", newDoc);

        // await docModel.updateDoc(newDoc);
    }

    return (
        <>
            <button className="create-btn" onClick={saveText}>
                Update
            </button>
            <button className="commentBox-btn" onClick={commentInput}>
                Add a comment
            </button>
            <button className="pdf-btn" onClick={downloadPDF}>
                Download as PDF
            </button>
            <div>
                <input
                    value={newDoc.title}
                    className="title-input"
                    onChange={changeTitle}
                    name="title"
                />
                {showCommentBox && (
                    <CommentBox editorRef={editorRef}
                    setShowCommentBox={setShowCommentBox}
                        showCommentBox={showCommentBox}
                    addCommentToDoc = {addComment} />
                )}
                <div className="neg-margin">
                    <ReactQuill
                        className="editor"
                        name="description"
                        theme="snow"
                        value={value}
                        onChange={updateState}
                        modules={modules}
                        style={{ height: "3in", margin: "1em", flex: "1" }}
                        ref={editorRef}
                    />
                    </div>
                <div>
                    <p>HI</p>
                </div>
            </div>
        </>
    );
}

export default UpdateDoc;

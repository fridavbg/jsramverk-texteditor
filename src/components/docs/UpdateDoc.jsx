import { useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import "quill-comment";
import "quill-comment/quill.comment.css";
import "react-quill/dist/quill.snow.css";
import { pdfExporter } from "quill-to-pdf";
import { saveAs } from "file-saver";
import { io } from "socket.io-client";
import docModel from "../../models/documents";

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
        ["contain"],
        ["comments-toggle"], // comment color on/off
        ["comments-add"], // comment add
    ],
    comment: {
        enabled: true,
        commentAuthorId: 123,
        commentAddOn: "Author Name", // any additional info needed
        color: "yellow", // comment background color in the text
        commentAddClick: commentAddClick, // get called when `ADD COMMENT` btn on options bar is clicked
        commentsClick: commentsClick, // get called when you click `COMMENTS` btn on options bar for you to do additional things beside color on/off. Color on/off is already done before the callback is called.
        commentTimestamp: commentServerTimestamp,
    },
};

let showCommentBox = false;

function commentAddClick(callback) {
    // UX works to get comment from user, like showing modal dialog
    //$('#inputCommentModal').modal('show');
    // But after whatever UX works, call the `callback` with comment to pass back comment
    // callback will be null when nth is selected
   // callback(modules.comment);
    console.log("open txt box");
    showCommentBox = true;
}

function commentServerTimestamp() {
    // call from server or local time. But must return promise with UNIX Epoch timestamp resolved (like 1507617041)
    return new Promise((resolve, reject) => {
        let currentTimestamp = Math.round(new Date().getTime() / 1000);

        resolve(currentTimestamp);
    });
}

function commentsClick() {
    console.log("comments btn callback");
}

function UpdateDoc() {
    const location = useLocation();
    const navigate = useNavigate();

    const [newDoc, setNewDoc] = useState({
        _id: location.state.doc._id,
        title: location.state.doc.title,
        description: location.state.doc.description,
    });

    const editorRef = useRef();
    const [socket, setSocket] = useState(null);
    const [value, setValue] = useState(newDoc.description);


    let newObject = {};

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
            };
            let newObject = {
                _id: newDoc._id,
                title: newDoc.title,
                description: text,
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

    if (showCommentBox) {
        return <>
        <button className="create-btn" onClick={saveText}>
            Update
        </button>
        <button className="pdf-btn" onClick={downloadPDF}>
            Download as PDF
        </button>
            <div>
            <input
                value="Comment"
                className="comment-input"
                name="comment"
            />
            <input
                value={newDoc.title}
                className="title-input"
                onChange={changeTitle}
                name="title"
            />
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
    </>
    }
    return (
        <>
            <button className="create-btn" onClick={saveText}>
                Update
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
        </>
    );
}

export default UpdateDoc;

import { useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import parse from "html-react-parser";
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

        ["clean"],
    ],
};

function UpdateDoc() {
    const location = useLocation();
    const navigate = useNavigate();

    const editorRef = useRef();
    const [socket, setSocket] = useState(null);
    const [decscription, setDescription] = useState("");
    let newObject = {};

    let sendToSocket = true;

    function changeSendToSocket(value) {
        sendToSocket = value;
    }

    const [newDoc, setNewDoc] = useState({
        _id: location.state.doc._id,
        title: location.state.doc.title,
        description: location.state.doc.description,
    });

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

    let updateEditorOnChange = false;

    function handleTextChange(event) {
        if (socket) {
            let updatedDoc = {
                _id: newDoc._id,
                description: parse(event).props.children,
            };
            socket.emit("update", updatedDoc);
            console.log("Sending ... ");
            console.log(updatedDoc.description);
        }
    }

    function updateEditor(
        content
        // ,
        // triggerChange
    ) {
        let editor = document.querySelector(".ql-editor > p");
        console.log("EDITOR UPDATE:");
        console.log(editor);
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

        navigate("/");
    }

    useEffect(() => {
        if (socket) {
            // create room with ID
            socket.emit("create", newDoc._id);
            socket.on("update", function (data) {
                console.log("received doc:");
                setNewDoc({ ...newDoc, description: data.description });
                console.log(newDoc);
                updateEditor(newDoc.description);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);

    return (
        <>
            <button className="create-btn" onClick={saveText}>
                Update
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
                    defaultValue={newDoc.description}
                    onChange={(event) => {
                        handleTextChange(event);
                        // updateEditor();
                    }}
                    modules={modules}
                    style={{ height: "3in", margin: "1em", flex: "1" }}
                    ref={editorRef}
                />
            </div>
        </>
    );
}

export default UpdateDoc;

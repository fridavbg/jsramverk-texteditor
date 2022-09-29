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

    const [newDoc, setNewDoc] = useState({
        _id: location.state.doc._id,
        title: location.state.doc.title,
        description: location.state.doc.description,
    });
    
    const editorRef = useRef();
    const [socket, setSocket] = useState(null);
    const [value, setValue] = useState(newDoc.description);

    let newObject = {};

    let sendToSocket = true;

    function changeSendToSocket(value) {
        sendToSocket = value;
    }

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

    function updateEditor(content, triggerChange) {
        // sendToSocket = triggerChange;
        // editorRef.current.editor.value = "";
        // console.log(editorRef.current.editor.value);
        // sendToSocket = triggerChange;
        console.log(editorRef.current.editor.getSelection());
        editorRef.current.editor.setText(content);
        // console.log(editorRef.current.editor.getSelection().index);
        // editorRef.current.editor.setSelection();
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
                console.log("Receiving from Socket:");
                console.log("Data: ");
                console.log(data.description);
                // setNewDoc({ ...newDoc, description: data.description });
                setValue(data.description);
                console.log("State: ");
                console.log(newDoc.description);
                // updateEditor(data.description);
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
            socket.emit("update", updatedDoc);

            // console.log("Sending ");
            // console.log(updatedDoc.description);

            // changeSendToSocket(true);
        }
    };

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
                    value={value}
                    // defaultValue={newDoc.description}
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

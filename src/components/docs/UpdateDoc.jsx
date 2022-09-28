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
    const editorRef = useRef();
    const [socket, setSocket] = useState(null);

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

    let updateEditorOnChange = false;

    function handleChange(event) {
        if (socket) {
            socket.emit("update", {
                _id: newDoc._id,
                description: parse(event).props.children,
            });
            console.log("Sending: ");
            console.log(newDoc);
            // if (updateEditorOnChange) {
            //     setNewDoc(newDoc);
            // }
        }
        // updateEditorOnChange = true;
    }

    function updateEditor(content, triggerChange) {
        let editor = document.querySelector(".ql-editor > p");
        console.log(editor);
        // updateeditorOnChange = triggerChange;
        editor.value = "";
        // editor.editor.setSelectedRange([0, 0]);
        // updateeditorOnChange = triggerChange;
        // editor.insertHTML(content);
    }

    useEffect(() => {
        if (socket) {
            // create room with ID
            socket.emit("create", newDoc._id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);

    useEffect(() => {
        if (socket) {
            socket.on("update", function (data) {
                console.log("received doc:");
                setNewDoc({ ...newDoc, description: data.description });
                console.log(newDoc);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newDoc]);

    return (
        <>
            <ReactQuill
                className="editor"
                name="description"
                theme="snow"
                defaultValue={newDoc.description}
                onChange={(event) => {
                    handleChange(event);
                    // updateEditor();
                }}
                modules={modules}
                style={{ height: "3in", margin: "1em", flex: "1" }}
                ref={editorRef}
            />
        </>
    );
}

export default UpdateDoc;

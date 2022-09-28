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

function UpdateDoc({
    socket,
    sendToSocket,
    changeSendToSocket,
    description,
    setDescription,
}) {
    const location = useLocation();

    const [newDoc, setNewDoc] = useState({
        _id: location.state.doc._id,
        title: location.state.doc.title,
        description: location.state.doc.description,
    });

    const editorRef = useRef();
    let newObject = {};
    const navigate = useNavigate();
    //if (editorRef.current) console.log(editorRef.current.editor.getContents());

    function changeTitle(event) {
        newObject[event.target.name] = event.target.value;
        setNewDoc({ ...newDoc, ...newObject });
    }

    function changeText(event) {
        newObject["description"] = event;
        // UPDATE Socket text by ID onChange Event
        updateDescription(newDoc._id, event);
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

        navigate("/");
    }

    function updateDescription(id, newDescription) {
        const tmpObject = {};

        tmpObject[id] = newDescription;

        console.log("Updating. . .");
        console.log(newDescription);
        console.log("tmpObject: ");
        console.log(tmpObject);
        setDescription({ ...newDescription, ...tmpObject });
        console.log("All descriptions in App: ");
        console.log(description);
    }

    let docById = newDoc._id;

    useEffect(() => {
        console.log("Socket room - ID used to create: ");
        console.log(docById);
        if (socket && sendToSocket) {
            socket.emit("create", docById);
        }
        changeSendToSocket(true);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [docById]);

    let DocToUpdate = description[newDoc._id];

    useEffect(() => {
        console.log("All descriptions in UpdateDoc: ");
        console.log(description);
        console.log("DocToUpdate: ");
        console.log(DocToUpdate);
        if (socket && sendToSocket) {
            socket.on("update", (DocToUpdate) => {
                socket.emit("update", DocToUpdate);
            });
        }
        changeSendToSocket(true);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [DocToUpdate]);

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
                    name="description"
                    theme="snow"
                    defaultValue={newDoc.description}
                    onChange={(event) => {
                        changeText(parse(event).props.children);
                    }}
                    modules={modules}
                    style={{ height: "3in", margin: "1em", flex: "1" }}
                    ref={editorRef}
                />
                Socket:
                {description[newDoc._id]}
            </div>
        </>
    );
}

export default UpdateDoc;
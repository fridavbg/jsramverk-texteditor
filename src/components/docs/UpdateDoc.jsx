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

    const [newDoc, setNewDoc] = useState({
        _id: location.state.doc._id,
        title: location.state.doc.title,
        description: location.state.doc.description,
    });

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

    useEffect(() => {
        if (socket) {
            socket.emit("create", newDoc._id);
            socket.on("update", function (data) {
                setNewDoc({ ...newDoc, description: data.description });
                console.log(data);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);

    return (
        <>
            <ReactQuill
                name="description"
                theme="snow"
                defaultValue={newDoc.description}
                onChange={(event) => {
                    console.log(parse(event).props.children);
                    if (socket) {
                        socket.emit("update", {
                            _id: newDoc._id,
                            description: parse(event).props.children,
                        });
                    }
                }}
                modules={modules}
                style={{ height: "3in", margin: "1em", flex: "1" }}
                ref={editorRef}
            />
        </>
    );
}

export default UpdateDoc;

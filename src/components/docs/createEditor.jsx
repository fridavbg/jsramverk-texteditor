import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
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

function CreateEditor() {
    const [newDoc, setNewDoc] = useState({});
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
        await docModel.createDoc(newDoc);

        navigate('/docs');
    }

    return (
        <>
            <button className="create-btn" onClick={saveText}>
                Save
            </button>
            <div>
                <input
                    placeholder="Add a title"
                    className="title-input"
                    onChange={changeTitle}
                    name="title"
                />
                <ReactQuill
                    name="text"
                    theme="snow"
                    placeholder={"Write something awesome..."}
                    onChange={(event) => {
                        changeText(event);
                    }}
                    modules={modules}
                    style={{ height: "3in", margin: "1em", flex: "1" }}
                    ref={editorRef}
                />
            </div>
        </>
    );
}

export default CreateEditor;

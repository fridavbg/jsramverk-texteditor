import { useNavigate, useLocation } from "react-router-dom";
import { useState, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import parse from "html-react-parser";
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

function UpdateDoc({ description, updateDescription }) {
    const location = useLocation();

    const [newDoc, setNewDoc] = useState({
        _id: location.state.doc._id,
        title: location.state.doc.title,
        description: location.state.doc.description,
    });

    description[newDoc._id] = location.state.doc.description;
    
    const editorRef = useRef();
    let newObject = {};
    const navigate = useNavigate();
    //if (editorRef.current) console.log(editorRef.current.editor.getContents());

    function changeHandler(event) {
        console.log(event);
        description[newDoc._id] = event;
        updateDescription({...description, ...newObject});
        console.log(description[newDoc._id])
    }

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
        // console.log("Doc goes into db: ");
        // console.log(newDoc);
        await docModel.updateDoc(newDoc);

        navigate("/");
    }

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
                    defaultValue={description[newDoc._id]}
                    onChange={(event) => {
                        changeText(parse(event).props.children);
                        changeHandler(parse(event).props.children);
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

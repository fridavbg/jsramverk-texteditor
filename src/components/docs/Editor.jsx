import { useState, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import parse from "html-react-parser";

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

function Editor() {
    const [newText, setNewText] = useState("");
    const editorRef = useRef();

    //if (editorRef.current) console.log(editorRef.current.editor.getContents());

    function changeHandler(event) {
        let newObject = {};
        if (event.target.name === "title" && editorRef.current && typeof parse(newText).props.children === 'string') {
            newObject[event.target.name] = event.target.value;
            newObject['description'] = parse(newText).props.children;
            console.log(newObject);
        }
        // console.alert('Please fill in both a title and text');
    }

    function saveText() {
        console.log("save object");
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
                    onChange={changeHandler}
                    name="title"
                />
                <ReactQuill
                    name="text"
                    theme="snow"
                    placeholder={"Write something awesome..."}
                    onChange={setNewText}
                    modules={modules}
                    style={{ height: "3in", margin: "1em", flex: "1" }}
                    ref={editorRef}
                />
            </div>
        </>
    );
}

export default Editor;

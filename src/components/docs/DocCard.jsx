import Editor from "./Editor";

function DocCard({ doc, index }) {
    function editor(e) {
        e.preventDefault();
        window.location = './Editor.jsx';
    }
    return (
        <div className="card">
            <h2>{doc.title}</h2>
            <p>{doc.description}</p>
            <button onClick={editor}className="edit-btn">Edit</button>
        </div>
    );
}

export default DocCard;

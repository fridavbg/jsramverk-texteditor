
function DocCard({ doc, index }) {
    function editor(e) {
        e.preventDefault();
        window.location = './Editor.jsx';
    }
    return (
        <div className="card">
            <h2>{doc.title}</h2>
            <p>{doc.description}</p>
            <button className="edit-btn">Edit</button>
        </div>
    );
}

export default DocCard;

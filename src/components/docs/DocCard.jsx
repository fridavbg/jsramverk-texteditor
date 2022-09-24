import { useNavigate } from "react-router-dom";

function DocCard({ doc, index, description, updateDescription }) {
    const navigate = useNavigate();
    const editDoc = ({ updateDescription }) => {
        navigate("/edit", {
            replace: true,
            state: {
                doc: doc,
                description: description,
            },
        });
    };

    return (
        <div className="card">
            {/* <p>{doc._id}</p> */}
            <h2>{doc.title}</h2>
            <p>{doc.description}</p>
            <button className="edit-btn" onClick={editDoc}>
                Edit
            </button>
        </div>
    );
}

export default DocCard;

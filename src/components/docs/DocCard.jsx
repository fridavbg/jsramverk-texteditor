import { useNavigate } from "react-router-dom";
import parse from "html-react-parser";

function DocCard({ doc, index }) {
    const navigate = useNavigate();
    const editDoc = () => {
        navigate("/edit", {
            replace: true,
            state: {
                doc: doc
            },
        });
    };

    const downloadPDF = () => {
        console.log(doc._id);
    }

    return (
        <div className="card">
            {/* <p>{doc._id}</p> */}
            <h2>{doc.title}</h2>
            <p>{parse(doc.description)}</p>
            <button className="edit-btn" onClick={editDoc}>
                Edit
            </button>
            <button className="pdf-btn" onClick={downloadPDF}>
                Download as PDF
            </button>
        </div>
    );
}

export default DocCard;

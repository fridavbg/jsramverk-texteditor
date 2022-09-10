import { Route } from 'react-router-dom';
import Editor from "./Editor";

function DocCard({ doc, index }) {
    return (
        <div className="card">
            <p>{doc._id}</p>
            <h2>{doc.title}</h2>
            <p>{doc.description}</p>
            {/* <Route exact path="/edit/{doc._id}" component={Editor} /> */}
            <button className="edit-btn">
                Edit
            </button>
        </div>
    );
}

export default DocCard;

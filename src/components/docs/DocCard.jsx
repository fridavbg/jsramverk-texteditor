import { useNavigate } from "react-router-dom";
import parse from "html-react-parser";
import { useState } from "react";

import emailModel from "../../models/mail";


function DocCard({ doc, index }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [showForm, setShowForm] = useState(false);

    const editDoc = () => {
        console.log("DocCard:", doc);
        navigate("/edit", {
            replace: true,
            state: {
                doc: doc,
            },
        });
    };

    const emailForm = () => {
        setShowForm(!showForm);
    };

    function changeEmail(event) {
        setEmail(event.target.value);
    }

    async function sendInvite(event) {
        event.preventDefault();
        setShowForm(!showForm);
        let sent = await emailModel.sendMail(email);
        console.log("DocCard:");
        console.log(sent);
    };

    return (
        <div className="card">
            {/* <p>{doc._id}</p> */}
            <h2>{doc.title}</h2>
            <p>{parse(doc.description)}</p>
            <button className="edit-btn" onClick={editDoc}>
                Edit
            </button>
            <button className="invite-btn" onClick={emailForm}>
                Invite someone to join
            </button>
            {showForm && (
                <form className="email-form">
                    <label className="label">Email:</label>
                    <input type="email" text="email" name="email" onChange={changeEmail}
                    required
                    />
                    <button className="send-btn" onClick={sendInvite}>Send</button>
                </form>
            )}
        </div>
    );
}

export default DocCard;

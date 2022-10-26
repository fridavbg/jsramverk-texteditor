import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Select from 'react-select';

import emailModel from "../../models/mail";


function DocCard({ doc, index }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [showNotification, setShowNotification] = useState(false);
    const [notification, setNotification] = useState("");
    const [showForm, setShowForm] = useState(false);

    const mailgun_emails = [
        { label: "fperssontech@gmail.com", value: 1 },
        { label: "efo@bth.se", value: 2 },
        { label: "emil.folino@bth.se", value: 3 },
    ];


    const editDoc = () => {
        navigate("/edit", {
            replace: true,
            state: {
                doc: doc,
            },
        });
    };

    const notificationBox = () => {
        setShowNotification(!showNotification);
    };

    const emailForm = () => {
        if (notification) {
            setNotification("")
            setShowNotification(!showNotification);
        }
        setShowForm(!showForm);
    };

    function changeEmail(event) {
        setEmail(event.label);
    }

    async function sendInvite(event) {
        setShowNotification(!showNotification);
        event.preventDefault();
        let sent = await emailModel.sendMail(email);
        if (sent.status === 400) {
            setNotification(sent.errors.message);
        };
        setNotification(sent.msg);
        setShowNotification(!showNotification);
        setShowForm(!showForm);
    };

    return (
        <div className="card">
            {/* <p>{doc._id}</p> */}
            <h2>{doc.title}</h2>
            <button className="edit-btn" onClick={editDoc}>
                Edit
            </button>
            <button className="invite-btn" onClick={emailForm}>
                Invite someone to join
            </button>
            {notificationBox && (
                <p className={showNotification ? 'not-msg' : 'invisible'}>{notification}</p>
            )}
            {showForm && (
                <form className="email-form">
                    <Select options={ mailgun_emails } onChange={changeEmail} />
                    <button className="send-btn" onClick={sendInvite}>Send</button>
                </form>
            )}
        </div>
    );
}

export default DocCard;

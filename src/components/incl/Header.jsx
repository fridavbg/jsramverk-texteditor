import { useNavigate } from "react-router-dom";

function Header() {
    const navigate = useNavigate();
    const goHome = () => {
        navigate("/");
    };

    const seeDocs = () => {
        navigate("/docs");
    };

    const createDoc = () => {
        navigate("/create");
    };
    return (
        <div className="header">
            <h1>React Text Editor</h1>
            <button className="nav-btn" onClick={goHome}>Main</button>
            <button className="nav-btn" onClick={seeDocs}>Documents</button>
            <button className="nav-btn" onClick={createDoc}>Create a document</button>
        </div>
    );
}

export default Header;

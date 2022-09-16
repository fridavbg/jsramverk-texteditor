import { Link } from "react-router-dom";

function Header() {
    return (
        <div className="header">
            <h1>React Text Editor</h1>
            <Link className="nav-btn" to="/">
                Main
            </Link>
            <Link className="nav-btn" to="/docs">
                Documents
            </Link>
            <Link className="nav-btn" to="/create">
                Create a document
            </Link>
        </div>
    );
}

export default Header;

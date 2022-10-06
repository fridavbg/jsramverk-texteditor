import { useNavigate } from "react-router-dom";

function Header({token}) {
    const navigate = useNavigate();
    const Login = () => {
        navigate("/login");
    };
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
            <button className="nav-btn" onClick={goHome}>
                Home
            </button>
            {token ? (
                <>
                    <button className="nav-btn" onClick={seeDocs}>
                        Documents
                    </button>
                    <button className="nav-btn" onClick={createDoc}>
                        Create a document
                    </button>
                </>
            ) : (
                <button className="nav-btn" onClick={Login}>
                    Login
                </button>
            )}
        </div>
    );
}

export default Header;

import authModel from "../../models/auth";

function Main() {
    return (
        <>
            {authModel.token ? (
                <>
                    <h3 className="title">Try to refresh on this page</h3>
                    <p>
                        If you have added or updated a document. Please refresh
                        this page now
                    </p>
                </>
            ) : (
                <>
                    <h3 className="title">Welcome</h3>
                    <p>
                        Please log in or register in order to use the texteditor
                    </p>
                </>
            )}
        </>
    );
}

export default Main;

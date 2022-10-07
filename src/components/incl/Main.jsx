function Main({ token }) {
    return (
        <>
            {token ? (
                <>
                    <div className="quote-wrapper">
                        <q>
                            As a writer, you should not judge, you should
                            understand.
                        </q>
                        <p> -- Ernest Hemingway</p>
                    </div>
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

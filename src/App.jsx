import "./styles/app.scss";
import { useState, useEffect } from "react";
import docModel from "./models/documents";
import Header from "./components/incl/Header";
import DocList from "./components/docs/DocList";
import CreateEditor from "./components/docs/createEditor";

function App() {
    const [state, setState] = useState("start");
    const [docs, setDocs] = useState([]);

    const CreateButton = (props) => {
        return (
            <button className="create-btn" onClick={props.addDoc}>
                Create a document
            </button>
        );
    };

    async function fetchDocs() {
        const allDocs = await docModel.getAllDocs();

        setDocs(allDocs);
    }

    useEffect(() => {
        (async () => {
            await fetchDocs();
        })();
    }, []);

    return (
        <div className="App">
            <Header />
            {state === "start" && (
                <main>
                    {/* <button className="create-btn">Create new document</button> */}
                    <CreateButton
                        addDoc={() => setState("create")}
                    />
                    <DocList docs={docs} />
                </main>
            )}
            {state === "create" && <CreateEditor />}
        </div>
    );
}

export default App;

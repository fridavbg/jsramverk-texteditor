import "./styles/app.scss";
import { useState, useEffect } from "react";
import docModel from "./models/documents";
import Header from "./components/incl/Header";
import DocList from "./components/docs/DocList";

function App() {
    const [docs, setDocs] = useState([]);

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
            <main>
                <DocList docs={docs} />
            </main>
        </div>
    );
}

export default App;

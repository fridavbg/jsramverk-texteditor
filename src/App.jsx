import "./styles/app.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import docModel from "./models/documents";
import Header from "./components/incl/Header";
import DocList from "./components/docs/DocList";
import Editor from "./components/docs/Editor";

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
        <Router className="App">
            <Header />
            <Routes>
                <Route path="/" element={<DocList docs={docs} />} />
                <Route path="/create" element={<Editor />} />
                <Route path="/edit" element={<Editor />} />
            </Routes>
        </Router>
    );
}

export default App;

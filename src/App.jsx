import "./styles/app.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import docModel from "./models/documents";
import Header from "./components/incl/Header";
import Main from "./components/incl/Main";
import DocList from "./components/docs/DocList";
import CreateEditor from "./components/docs/CreateEditor";
import UpdateDoc from "./components/docs/UpdateDoc";

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
            <Route
                    path="/"
                    element={<Main />}
                />
                <Route
                    path="/docs"
                    element={<DocList docs={docs} />}
                />
                <Route path="/create" element={<CreateEditor />} />
                <Route path="/edit" element={<UpdateDoc />} />
            </Routes>
        </Router>
    );
}

export default App;

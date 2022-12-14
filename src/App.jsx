import "./styles/app.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import docModel from "./models/documents";
import Header from "./components/incl/Header";
import Main from "./components/incl/Main";
import DocList from "./components/docs/DocList";
import CreateEditor from "./components/docs/CreateEditor";
import UpdateDoc from "./components/docs/UpdateDoc";
import Login from "./components/auth/Login";

function App() {
    const [user, setUser] = useState({});
    const [docs, setDocs] = useState([]);
    const [description, setDescription] = useState({});
    const [token, setToken] = useState("");
    
    async function fetchDocs() {
        const allDocs = await docModel.getAllDocs(token);
        // console.log(allDocs);

        // All Descriptions default value
        if (allDocs) {
            const descriptionsObject = allDocs.reduce((acc, doc) => {
                let tmpObject = {};
                tmpObject[doc._id] = doc.description;
                return { ...acc, ...tmpObject };
            }, {});
            setDescription(descriptionsObject);
            setDocs(allDocs);
        }
    }

    useEffect(() => {
        (async () => {
            await fetchDocs();
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    return (
        <BrowserRouter className="App" basename={docModel.baseName}>
            <Header token={token} />
            <Routes>
                <Route path="/" element={<Main token={token} />} />
                {token ? (
                    <>
                        <Route path="/docs"
                            element={<DocList
                            docs={docs}
                            setDocs={setDocs}
                            token={token}
                        />} />
                        <Route path="/create"
                            element={<CreateEditor />} />
                        <Route
                            path="/edit"
                            element={
                                <UpdateDoc
                                user={user}
                                />} />
                    </>
                ) : (
                    <>
                        <Route
                            path="/login"
                                element={<Login
                                    setUser={setUser}
                                    user={user}
                                    setToken={setToken} />}
                        />
                    </>
                )}
            </Routes>
        </BrowserRouter>
    );
}

export default App;

import "./styles/app.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import docModel from "./models/documents";
import Header from "./components/incl/Header";
import Main from "./components/incl/Main";
import DocList from "./components/docs/DocList";
import CreateEditor from "./components/docs/CreateEditor";
import UpdateDoc from "./components/docs/UpdateDoc";
import Login from "./components/auth/Login";

function App() {
    const [docs, setDocs] = useState([]);
    const [socket, setSocket] = useState(null);
    const [description, setDescription] = useState({});
    const [token, setToken] = useState("");

    async function fetchDocs() {
        const allDocs = await docModel.getAllDocs(token);

        // All Descriptions default value
        const descriptionsObject = allDocs.reduce((acc, doc) => {
            let tmpObject = {};
            tmpObject[doc._id] = doc.description;
            return { ...acc, ...tmpObject };
        }, {});

        setDescription(descriptionsObject);
        setDocs(allDocs);
    }

    useEffect(() => {
        (async () => {
            await fetchDocs();
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    // Socket -> localhost connection
    useEffect(() => {
        setSocket(io(docModel.baseUrl));
        return () => {
            if (socket) {
                socket.disconnect();
                console.log("Disconnected");
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [description]);

    return (
        <BrowserRouter className="App" basename={docModel.baseName}>
            <Header token={token} />
            <Routes>
                <Route path="/" element={<Main token={token} />} />
                {token ? (
                    <>
                        <Route path="/docs" element={<DocList docs={docs} />} />
                        <Route path="/create" element={<CreateEditor />} />
                        <Route path="/edit" element={<UpdateDoc />} />
                    </>
                ) : (
                    <>
                        <Route
                            path="/login"
                            element={<Login setToken={setToken} />}
                        />
                    </>
                )}
            </Routes>
        </BrowserRouter>
    );
}

export default App;

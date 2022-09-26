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

let sendToSocket = false;

function changeSendToSocket(value) {
    sendToSocket = value;
}

function App() {
    const [docs, setDocs] = useState([]);
    const [socket, setSocket] = useState(null);
    const [description, setDescription] = useState({});

    async function fetchDocs() {
        const allDocs = await docModel.getAllDocs();

        setDocs(allDocs);
    }

    useEffect(() => {
        (async () => {
            await fetchDocs();
        })();
    });

    let selectedDoc = description["_id"];

    useEffect(() => {
        if (socket && sendToSocket) {
            socket.emit("create", description["_id"]);
        }
        changeSendToSocket(true);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDoc]);

    let currentDoc = description; 

    useEffect(() => {
        if (socket && sendToSocket) {
            socket.on("update", (data) => {
                socket.emit("update", data);
                console.log(currentDoc);
            });
        }
        changeSendToSocket(true);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentDoc]);

    // Socket -> localhost connection
    useEffect(() => {
        setSocket(io(docModel.baseUrl));
        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [description]);

    return (
        <BrowserRouter className="App" basename={docModel.baseName}>
            <Header />
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/docs" element={<DocList docs={docs} />} />
                <Route path="/create" element={<CreateEditor />} />
                <Route
                    path="/edit"
                    element={
                        <UpdateDoc
                            description={description}
                            setDescription={setDescription}
                        />
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

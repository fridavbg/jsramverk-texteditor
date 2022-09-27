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
        // add all descriptions to

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
    }, []);

    let DocToUpdate = description;

    useEffect(() => {
        console.log("DocToUpdate: ");
        console.log(DocToUpdate);
        if (socket && sendToSocket) {
            socket.on("update", (DocToUpdate) => {
                socket.emit("update", DocToUpdate);
            });
        }
        changeSendToSocket(true);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [DocToUpdate]);

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

    function updateDescription(id, newDescription) {
        const tmpObject = {};

        tmpObject[id] = newDescription;

        setDescription({ ...newDescription, ...tmpObject });
        console.log(description);
    }

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
                            socket={socket}
                            sendToSocket={sendToSocket}
                            changeSendToSocket={changeSendToSocket}
                            description={description}
                            updateDescription={updateDescription}
                        />
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

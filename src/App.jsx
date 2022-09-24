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

        const descriptionObj = allDocs.reduce((acc, doc) => {
            let tmpObject = {};
            tmpObject[doc._id] = doc.description;
            return { ...acc, ...tmpObject };
        }, {});
        setDescription(descriptionObj);
        console.log(description);
        setDocs(allDocs);
    }

    useEffect(() => {
        (async () => {
            await fetchDocs();
        })();
    }, []);

    useEffect(() => {
        console.log(sendToSocket);
        if (socket && sendToSocket) {
            socket.emit("description", description);
        }

        changeSendToSocket(true);
        console.log(sendToSocket);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [description]);

    // Socket -> localhost connection
    useEffect(() => {
        setSocket(io(docModel.baseUrl));
        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Socket -> localhost update after change
    useEffect(() => {
        if (socket) {
            socket.on("description", function (data) {
                changeSendToSocket(false);
                setDescription(data);
            });
        }
    }, [socket]);

    function updateDescription(id, newDescription) {
        const tmpObject = {};
        tmpObject[id] = newDescription;
        setDescription({ ...description, ...tmpObject });
    }

    return (
        <BrowserRouter className="App" basename={docModel.baseName}>
            <Header />
            <Routes>
                <Route path="/" element={<Main />} />
                <Route
                    path="/docs"
                    element={
                        <DocList
                            docs={docs}
                            description={description}
                            updateDescription={updateDescription}
                        />
                    }
                />
                <Route
                    path="/create"
                    element={
                        <CreateEditor
                            description={description}
                            updateDescription={updateDescription}
                        />
                    }
                />
                <Route path="/edit" element={<UpdateDoc />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

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

        // set initial value for socket description
        const descriptionObj = allDocs.reduce((acc, doc) => {
            let tmpObject = {};
            tmpObject[doc._id] = doc.description;
            return { ...acc, ...tmpObject };
        }, {});

        setDescription(descriptionObj);

        setDocs(allDocs);
    }

    useEffect(() => {
        (async () => {
            await fetchDocs();
        })();
    });

    useEffect(() => {
        if (socket && sendToSocket) {
            socket.emit("update", description);
        }
        changeSendToSocket(true);

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
            socket.on("update", function (data) {
                changeSendToSocket(false);
                console.log(data);
                setDescription(data);
            });
        }
    }, [socket]);

    function updateDescription(id, newDescription) {
        const tmpObject = {};
        tmpObject[id] = newDescription;
        setDescription({ ...description, ...tmpObject });
        console.log("DESCRIPTION: ");
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

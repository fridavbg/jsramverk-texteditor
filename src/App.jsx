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

            setDescription({ "631cf7f83991e1dde312ef74": "Socket update" });
        })();
    }, []);

    useEffect(() => {
        // console.log("App.jsx - From socket");
        // console.log(description);
    }, [description]);

    // Socket -> localhost connection
    useEffect(() => {
        setSocket(io("http://localhost:1337"));
        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Socket -> localhost update after change
    // useEffect(() => {
    //     socket.on("description", function (data) {
    //         console.log(data);
    //     })
    // }, [socket])

    function updateDescription(id, newDescription) {
        const tmpObject = {};
        tmpObject[id] = newDescription;
        setDescription(...description, ...tmpObject);
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
                <Route path="/create" element={<CreateEditor />} />
                <Route path="/edit" element={<UpdateDoc />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

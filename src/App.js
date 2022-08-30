import "./styles/app.scss";
import Header from "./components/incl/Header";
import Editor from "./components/Editor";

function App() {
    return (
        <div className="App">
            <Header />
            <div>
                <Editor />
            </div>
        </div>
    );
}

export default App;

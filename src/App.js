import "./styles/app.scss";
import Header from "./components/incl/Header";
import Editor from "./components/Editor";

import Footer from "./components/incl/Footer";

function App() {
    return (
        <div className="App">
            <Header />
            <div>
                {/* <Editor /> */}
                <div className="parent">
                    <div className="child" />
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { render, screen } from "@testing-library/react";

import Main from "../incl/Main.jsx";
import DocList from "./DocList.jsx";

const listOfDocs = [
    {
        title: "Test I",
        description: "Blah blaha blipidi pipbob",
    },
    {
        title: "Test II",
        description: "Blah blaha blipidi pipbob",
    },
];

test("render a document in a DocCard", () => {
    render(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<DocList docs={listOfDocs} />} />
            </Routes>
        </BrowserRouter>
    );
    const docList = screen.getByText("Test I");
    expect(docList).toBeDefined();
});

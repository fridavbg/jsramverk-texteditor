import { BrowserRouter, Routes, Route } from "react-router-dom";
import { render, screen } from "@testing-library/react";

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

test("render documents in a DocList", () => {
    render(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<DocList docs={listOfDocs} />} />
            </Routes>
        </BrowserRouter>
    );
    const docList = screen.getAllByText(/Test i/i);
    expect(docList).toBeDefined();
    expect(docList).toHaveLength(2);
});

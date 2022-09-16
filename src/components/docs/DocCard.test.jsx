import { BrowserRouter, Routes, Route } from "react-router-dom";
import { render, screen } from "@testing-library/react";

import DocCard from "./DocCard.jsx";

const doc = {
    title: "Test I",
    description: "Blah blaha blipidi pipbob",
};

test("render a document in a DocCard", () => {
    render(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<DocCard doc={doc} />} />
            </Routes>
        </BrowserRouter>
    );
    const docCard = screen.getAllByText(/Test i/i);
    expect(docCard).toBeDefined();
});

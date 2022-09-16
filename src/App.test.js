import { render, screen } from "@testing-library/react";
import Header from "./components/incl/Header.jsx";
import Main from "./components/incl/Main.jsx";

jest.mock("./components/incl/Header.jsx");

test("renders main page", () => {
    render(<Main />);
    const main = screen.getByText("Welcome");

    expect(main).toBeDefined();
});

test("renders header page", () => {
    Header.mockImplementation(() => <div>React Text Editor</div>);

    render(<Header />);

    const header = screen.getByText("React Text Editor");

    expect(header).toBeDefined();
});

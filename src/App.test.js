import { render, screen } from "@testing-library/react";
import Header from "./components/incl/Header.jsx";
import Main from "./components/incl/Main.jsx";

jest.mock("./components/incl/Header.jsx");
jest.mock("./components/docs/DocList.jsx");

test("renders main page", () => {
    const { getByText } = render(<Main />);
    const main = getByText("Welcome");

    expect(main).toBeDefined();
});

test("renders header page", () => {
    Header.mockImplementation(() => <div>React Text Editor</div>);

    const { getByText } = render(<Header />);

    const header = getByText("React Text Editor");

    expect(header).toBeDefined();
});

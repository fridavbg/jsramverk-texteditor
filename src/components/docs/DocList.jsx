import DocCard from "./DocCard";

function DocList({ docs }) {
    const docCards = docs.map((doc, index) => {
        return <DocCard doc={doc} key={index}></DocCard>;
    });
    return (
        <>
            <h2 className="title">Documents</h2>
            <div className="list">{docCards}</div>
        </>
    );
}

export default DocList;

import DocCard from "./DocCard";

function DocList({ docs }) {
    const docCards = docs.map((doc, index) => {
        return <DocCard key={index} doc={doc} />;
    });
    return <div className="list">{docCards}</div>;
}

export default DocList;

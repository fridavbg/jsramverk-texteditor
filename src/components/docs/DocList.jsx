import DocCard from "./DocCard";

function DocList({ docs}) {
    const docCards = docs.map((doc, index) => {
        return (
            <DocCard
                key={index}
                doc={doc}
            />
        );
    });
    if (docCards.length > 0) {
        return <div className="list">{docCards}</div>;
    } else {
        return <p>No documents are in the database</p>;
    }
}

export default DocList;

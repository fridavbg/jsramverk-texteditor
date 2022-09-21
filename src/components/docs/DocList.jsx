import DocCard from "./DocCard";

function DocList({ docs, description, updateDescription }) {
    const docCards = docs.map((doc, index) => {
        console.log("Socket - Doclist");
        console.log(description);
        return (
            <DocCard
                key={index}
                doc={doc}
                description={description[doc._id]}
                updateDescription={updateDescription}
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

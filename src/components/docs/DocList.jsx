import DocCard from "./DocCard";

function DocList({ docs }) {

    const docCards = docs.map((doc, index) => {
        return <DocCard doc={doc} key={index}></DocCard>
    })
    return (
        <div className="title">
            <h1>Documents</h1>
            {docCards}
        </div>
    );
}

export default DocList;

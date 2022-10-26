import { useEffect } from "react";

import docModel from "../../models/documents";
import DocCard from "./DocCard";

function DocList({ docs, setDocs, token }) {

    async function fetchDocs() {
        const allDocs = await docModel.getAllDocs(token);
        setDocs(allDocs);
    }
    
    useEffect(() => {
        (async () => {
            await fetchDocs();
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [docs]);


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
        return <p className="notification">No documents are in the database</p>;
    }
}

export default DocList;

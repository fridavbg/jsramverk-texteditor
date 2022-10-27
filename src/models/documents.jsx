const docModel = {
    baseUrl: window.location.href.includes("localhost")
        ? "http://localhost:1337"
        : "https://jsramverk-editor-frpe21.azurewebsites.net",
    baseName: window.location.href.includes("localhost")
        ? "/"
        : "/~frpe21/editor/",
    getAllDocs: async function getAllDocs(token) {
        if (token) {
            const response = await fetch(`${docModel.baseUrl}/graphql`, {
                method: "POST",
                headers: {
                    "x-access-token": token,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    query: "{ documents { _id title description comments { user comment range { index length }} } }",
                }),
            });
    
            const result = await response.json();
    
            return result.data.documents;
        }
    },
    getOneDoc: async function getOneDoc(id) {
        const response = await fetch(
            `${docModel.baseUrl}/docs/edit/${id}`,
            {
                headers: {
                    "content-type": "application/json",
                },
                method: "GET",
            }
        );
        const result = await response.json();

        return result;
    },  
    createDoc: async function createDoc(newDoc) {
        const response = await fetch(`${docModel.baseUrl}/docs/create`, {
            body: JSON.stringify(newDoc),
            headers: {
                "content-type": "application/json",
            },
            method: "POST",
        });

        const result = await response.json();

        return result.data;
    },
    updateDoc: async function updateDoc(updateDoc) {
        const response = await fetch(
            `${docModel.baseUrl}/docs/edit/${updateDoc._id}`,
            {
                body: JSON.stringify(updateDoc),
                headers: {
                    "content-type": "application/json",
                },
                method: "POST",
            }
        );
        const result = await response.json();

        return result;
    },
};

export default docModel;

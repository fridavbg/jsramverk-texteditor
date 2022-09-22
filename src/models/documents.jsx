const docModel = {
    baseUrl: window.location.href.includes("localhost")
        ? "http://localhost:1337"
        : "https://jsramverk-editor-frpe21.azurewebsites.net",
    baseName: window.location.href.includes("localhost") ? "/" : "/~frpe21/editor/",
    getAllDocs: async function getAllDocs() {
        const response = await fetch(`${docModel.baseUrl}/docs`);

        const docs = await response.json();

        return docs.data;
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
        console.log(result.data);
        return result.data;
    },
};

export default docModel;

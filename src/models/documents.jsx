const docModel = {
    baseUrl: window.location.href.includes(":1337") ?
        "http://localhost:1337" :
        "https://jsramverk-editor-frpe21.azurewebsites.net",
    getAllDocs: async function getAllDocs() {
        const response = await fetch(`${docModel.baseUrl}/docs`);

        const docs = await response.json();

        return docs.data;
    },
    createDoc: async function createDoc(newDoc) {
        const response = await fetch(`${docModel.baseUrl}/docs/create`, {
            body: JSON.stringify(newDoc),
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST'
        });

        const result = await response.json();

        console.log(result);
    },
};

export default docModel;

import { JsxEmit } from "typescript";

const docModel = {
    baseUrl: window.location.href.includes("localhost")
        ? "http://localhost:1337"
        : "https://jsramverk-editor-frpe21.azurewebsites.nets",
    getAllDocs: async function getAllDocs() {
        const response = await fetch(`${docModel.baseUrl}/docs`);

        const docs = await response.json();

        return docs.data;
    },
    createDoc: async function createDoc(newDoc) {
        const response = await fetch(`${docModel.baseUrl}/docs`, {
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

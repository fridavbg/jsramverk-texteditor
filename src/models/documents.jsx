const docModel = {
    baseUrl: window.location.href.includes("localhost")
        ? "http://localhost:1337"
        : "https://jsramverk-editor-frpe21.azurewebsites.nets",
    getAllDocs: async function getAllDocs() {
        const response = await fetch(`${docModel.baseUrl}/docs`);

        const docs = await response.json();

        return docs.data;
    },
};

export default docModel;

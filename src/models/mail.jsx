const emailModel = {
    baseUrl: window.location.href.includes("localhost")
    ? "http://localhost:1337/mail"
    : "https://jsramverk-editor-frpe21.azurewebsites.net/mail",
    sendMail: async function sendMail(mail) {

        const response = await fetch(
            `${emailModel.baseUrl}/send`, {
            body: JSON.stringify({mail: mail}),
            headers: {
                "content-type": "application/json",
            },
            method: "POST",
        });

        const result = await response.json();
        return result;
    }
}

export default emailModel;
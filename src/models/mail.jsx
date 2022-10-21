const emailModel = {
    baseUrl: window.location.href.includes("localhost")
    ? "http://localhost:1337"
    : "https://jsramverk-editor-frpe21.azurewebsites.net",
    sendMail: async function sendMail(mail) {
        
        console.log(mail);

        // const response = await fetch(
        //     `${emailModel.baseUrl}/mail/send`, {
        //     body: JSON.stringify(mail),
        //     headers: {
        //         "content-type": "application/json",
        //     },
        //     method: "POST",
        // });

        // const result = await response.json();
        // console.log("sendMail: ");
        // console.log(result);
        // return result.data;
    }
}

export default emailModel;
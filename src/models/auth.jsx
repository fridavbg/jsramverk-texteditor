const auth = {
    baseUrl: window.location.href.includes("localhost")
        ? "http://localhost:1337"
        : "https://jsramverk-editor-frpe21.azurewebsites.net",
    token: "",
    login: async function login(user) {
        const response = await fetch(`${this.baseUrl}/auth/login`, {
            method: "POST",
            body: JSON.stringify(user),
            headers: {
                "content-type": "application/json",
            },
        });

        const result = await response.json();

        return result;
    },
    register: async function register(user) {
        const response = await fetch(`${this.baseUrl}/auth/register`, {
            method: "POST",
            body: JSON.stringify(user),
            headers: {
                "content-type": "application/json",
            },
        });
        const result = await response.json();

        return result;
    },
};

export default auth;

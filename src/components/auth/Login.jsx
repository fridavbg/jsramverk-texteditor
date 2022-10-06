import { useNavigate } from "react-router-dom";
import { useState } from "react";

import authModel from "../../models/auth";

function Login({ setToken }) {
    const navigate = useNavigate();
    const [user, setUser] = useState({});

    function changeHandler(event) {
        let newObject = {};

        newObject[event.target.name] = event.target.value;

        setUser({ ...user, ...newObject });
    }

    async function register() {
        const registerResult = await authModel.register(user);

        console.log("register", registerResult.data);

        if (registerResult.data.token) {
            setToken(registerResult.data.token);
        }
    }

    async function login() {
        const loginResult = await authModel.login(user);

        console.log("login:", loginResult.data);

        if (loginResult.data.token) {
            setToken(loginResult.data.token);
            navigate("/");
        }
    }

    return (
        <>
            <h1 className="title">Login / Registrera</h1>
            <form className="login-form">
                <label>Email:</label>
                <input
                    type="email"
                    name="email"
                    onChange={changeHandler}
                    required
                />
                <label>Password:</label>
                <input
                    type="password"
                    name="password"
                    onChange={changeHandler}
                    required
                />
                <button onClick={register}>Registrera</button>
                <button onClick={login}>Logga in</button>
            </form>
        </>
    );
}

export default Login;

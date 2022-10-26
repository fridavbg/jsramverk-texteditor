import { useNavigate } from "react-router-dom";
import { useState } from "react";

import authModel from "../../models/auth";

function Login({ setToken }) {
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    function changeHandler(event) {
        let newObject = {};

        newObject[event.target.name] = event.target.value;
        setUser({ ...user, ...newObject });
    }

    async function register() {
        setMessage("");
        setError("");
        const registerResult = await authModel.register(user);

        // console.log("register", registerResult.errors);

        if (registerResult.errors !== undefined) {
            setError(registerResult.errors.message);
        }
        if (registerResult.data.message !== undefined) {
            setMessage(registerResult.data.message);
        }

        if (registerResult.data.token) {
            setToken(registerResult.data.token);
        }
    }

    async function login() {
        setMessage("");
        setError("");
        const loginResult = await authModel.login(user);
        console.log("login:", loginResult.data);

        if (loginResult.errors !== undefined) {
            setError(loginResult.errors.message);
        }

        if (loginResult.data !== undefined) {
            setMessage(loginResult.data.message);
        }

        if (loginResult.data.token) {
            setToken(loginResult.data.token);
            navigate("/");
        }
    }

    if (error || message) {
        return (
            <div className="login-form">
                <h1 className="title">Login / Registrera</h1>
                <p className="err-msg">
                    {error || message}
                </p>
                <label>Email:</label>
                <input type="email" name="email" onChange={changeHandler} />
                <label>Password:</label>
                <input
                    type="password"
                    name="password"
                    onChange={changeHandler}
                    required
                />
                <button className="register-btn" onClick={register}>
                    Registrera
                </button>
                <button className="login-btn" onClick={login}>
                    Logga in
                </button>
            </div>
        );
    }
    return (
        <div className="login-form">
            <h1 className="title">Login / Registrera</h1>
            <label>Email:</label>
            <input type="email"
                name="email"
                onChange={changeHandler}
            />
            <label>Password:</label>
            <input
                type="password"
                name="password"
                onChange={changeHandler}
                required
            />
            <button
                className="register-btn"
                onClick={register}
            >
                Registrera
            </button>
            <button className="login-btn" onClick={login}>
                Logga in
            </button>
        </div>
    );
}

export default Login;

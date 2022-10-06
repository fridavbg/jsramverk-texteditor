import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

import authModel from "../../models/auth"

function Login() {
    const navigate = useNavigate();
    const [user, setUser] = useState({});

    function changeHandler(event) {
        let newObject = {};

        newObject[event.target.name] = event.target.value;

        setUser({ ...user, ...newObject });
    }

    async function register() {
        await authModel.register(user);
    }

    async function login() {
        await authModel.login(user);

        navigate("/");
    }

    return (
        <div className="login-form">
            <h1 className="title">Login / Registrera</h1>
            <input type="email" name="email" onChange={changeHandler} />
            <input type="password" name="password" onChange={changeHandler} />
            <button onClick={register}>Registrera</button>
            <button onClick={login}>Logga in</button>
        </div>
    );
}

export default Login;

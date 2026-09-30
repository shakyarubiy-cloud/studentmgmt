import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css';

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate= useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);

            localStorage.setItem("token", data.token);
              localStorage.setItem("role", data.role);
            navigate('/home');
        });
    };

    return (
        <form onSubmit={handleLogin} className="loginBox">


            <h1>Login</h1>

            <input
            className="logInput"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <br/><br/>

            <input
            className="logInput"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit" className="loginB">
                Login
            </button>
 <h4>Don't have an account?</h4>
        <p onClick={() => navigate('/register')} style={{cursor:'pointer'}}>
  Register
</p>
        </form>
       
    );
};

export default Login;
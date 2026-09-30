import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const [uname, setUname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    fetch("http://localhost:3000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: uname,
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        navigate("/login");
      })
      .catch((err) => console.log(err));
  };

  return (
    <form onSubmit={handleRegister} className="registerBox">

      <h1>Register</h1>

      <input
        className="regInput"
        type="text"
        placeholder="Enter your username"
        value={uname}
        onChange={(e) => setUname(e.target.value)}
      />

      <input
        className="regInput"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="regInput"
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        className="regInput"
        type="text"
        placeholder="Enter your role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />

      <button type="submit" className="registerB">
        Register
      </button>

      <h4>Already have an account?</h4>

      <p
        className="loginLink"
        onClick={() => navigate("/login")}
      >
        Login
      </p>

    </form>
  );
};

export default Register;
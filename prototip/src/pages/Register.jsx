// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo/logo.ico';
import '../App.css';
import axios from "axios";



const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  const handleRegister = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("http://localhost:5000/api/auth/register", {
      username,
      email: email.trim().toLowerCase(),
      password,
      confirmPassword,
    });
    console.log(res.data.message);
    navigate("/login"); // başarılıysa login sayfasına yönlendirir
  } catch (err) {
    console.error("Kayıt sırasında hata oluştu:", err.response.data.message);
  }
};

  return (
    <div className="login-container">
      <form onSubmit={handleRegister} className="login-box">
        <div className="login-header">
          <img src={logo} alt="logo" className="login-logo" />
          <h1 className="login-title">DailyWise</h1>
        </div>

        <h2 className="login-heading">REGISTER</h2>

        <input
            type="text"
            placeholder="user name"
            className="login-input"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
        />

        <input
            type="email"
            placeholder="email"
            className="login-input"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

        <input
          type="password"
          placeholder="password"
          className="login-input"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <input
          type="password"
          placeholder="confirm password"
          className="login-input"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />


        <button type="submit" className="login-button">REGISTER</button>
      </form>
    </div>
  );
};

export default Register;

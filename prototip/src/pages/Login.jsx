// src/pages/Login.jsx
import React, { useState } from 'react';
import axios from "axios";
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/logo/logo.ico';
import '../App.css';

const Login = () => {
  const navigate = useNavigate();

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const handleLogin = async (e) => {
  e.preventDefault();
  console.log("login denendi");

  try {
    const res = await axios.post("https://daily-wise-online-calender.onrender.com/login", {
      email: email.trim().toLowerCase(),
      password,
    });

    const { token, user } = res.data;
    console.log("Kullanıcı objesi:", user);
    // 👉 Gerekli kullanıcı bilgilerini localStorage'a kaydet
    localStorage.setItem("token", token);
    localStorage.setItem("userId", user._id);
    localStorage.setItem("username", user.username);
    localStorage.setItem("email", user.email);
    localStorage.setItem("password", user.password); // şifreyi göstermek istersen, güvenlik açısından saklamamak daha iyi olur

    // 👉 Günlük plan sayfasına yönlendir
    navigate("/gunluk");
    window.location.reload();
  } catch (err) {
    console.error("Login hatası:", err);
    alert(err.response?.data?.message || err.message || "Giriş sırasında hata oluştu.");
  }
};

 return (
  <div className="login-container">
    <form onSubmit={handleLogin} className="login-box">

     <div className="login-header">
  {<img src={logo} alt="logo" className="login-logo" />}
  <h1 className="login-title">DailyWise</h1>
     </div>

      <h2 className="login-heading">LOGIN</h2>

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


      <div className="login-links">
        <Link to="/forgot-password" className="link">Forget Password</Link>
        <Link to="/register" className="link">Register</Link>
      </div>

      <button type="submit" className="login-button">LOG IN</button>
    </form>
  </div>
);

};

export default Login;

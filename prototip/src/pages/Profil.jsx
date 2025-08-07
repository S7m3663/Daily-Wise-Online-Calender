import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Profil.css";
import ProfileModal from "./ProfileModal";

const Profile = () => {
  //const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  /*const [user, setUser] = useState({
    _id: "",
    username: "",
    email: "",
    password: ""
  });

  // localStorage'dan kullanıcı bilgilerini al
    useEffect(() => {
    const userData = {
      _id: localStorage.getItem("userId"),
      username: localStorage.getItem("username"),
      email: localStorage.getItem("email"),
      password: localStorage.getItem("password"),
    };
    setUser(userData);
  }, []);

 Kullanıcıyı silme fonksiyonu
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Hesabınızı silmek istediğinize emin misiniz?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:5000/api/users/${user._id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        alert("Hesabınız silindi.");
        localStorage.clear();
        navigate("/login");
      } else {
        alert("Silme başarısız.");
      }
    } catch (err) {
      console.error("Silme hatası:", err);
      alert("Sunucu hatası.");
    }
  };

  const handleClose = () => navigate(-1);
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };*/

  return (
    <div className="profile-card">
      <div className="profile-header">
        <span className="profile-icon">👤</span>
        <h2>Hesabım</h2>
      </div>

      <div className="modal">
        <p className="greeting">Merhaba {user.username}</p>
        <button className="profile-button">{user.username}</button>
        <button className="profile-button">{user.email}</button>
        <button className="profile-button">{user.password}</button>
      </div>

      <div className="profile-actions">
        <button onClick={() => setShowProfile(true)} className="icon-button">⚙</button>
        <button onClick={handleLogout} className="icon-button">↩</button>
        <button onClick={handleClose} className="icon-button">❌</button>
      </div>

      {/* Profil Modalı */}
      {showProfile && (
        <ProfileModal
          user={user}
          onClose={() => setShowProfile(false)}
          onDelete={handleDeleteAccount}
        />
      )}
    </div>
  );
};

export default Profile;

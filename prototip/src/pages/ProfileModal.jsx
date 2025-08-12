import "./ProfileModal.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import IconButton from '@mui/material/IconButton';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

const ProfileModal = ({ onClose }) => {
  const navigate = useNavigate();

 const [user, setUser] = useState({
  _id: localStorage.getItem("userId") || "",
  username: localStorage.getItem("username") || "",
  email: localStorage.getItem("email") || "",
  password: localStorage.getItem("password") || ""
});


  useEffect(() => {
    setUser({
      _id: localStorage.getItem("userId"),
      username: localStorage.getItem("username"),
      email: localStorage.getItem("email"),
      password: localStorage.getItem("password")
    });
  }, []);

  /* 2. user güncellenince inputlara yaz
useEffect(() => {
  setEditedName(user.username);
  setEditedEmail(user.email);
}, [user]);*/


  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Hesabınızı silmek istediğinize emin misiniz?");
    if (!confirmDelete) return;

    try {
     const res = await fetch(`http://localhost:5000/api/users/${user._id}`, {
    method: "DELETE"
    });;

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

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user.name);
  const [editedEmail, setEditedEmail] = useState(user.email);

  /*const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    navigate("/login");
  };*/

  const handleSave = async () => {
  try { 
  //localStorage.setItem("username") ;
    const userId = localStorage.getItem("userId"); //profil güncelleme işlemi
    console.log(" Kullanıcı ID:", userId);
    const res = await fetch(`https://daily-wise-online-calender.onrender.com/${userId}`, {
      method: "PUT",
      headers: { //json veri gönderileceği için 
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: editedName,
        email: editedEmail
      })
    });

    if (res.ok) {
      const updatedUser = await res.json();
      localStorage.setItem("username", updatedUser.username);
      localStorage.setItem("email", updatedUser.email);
      setIsEditing(false);
      window.location.reload();
    } else {
      alert("Güncelleme başarısız.");
    }
  } catch (err) {
    console.error("Güncelleme hatası:", err);
  }
};


  return (
    <div className="modal-overlay">
      <div className="Profilemodal">
        <div className="profile-header">
          <span className="profile-icon">👤</span>
          <h2>Hesabım</h2>
        </div>

        <p className="greeting" > Merhaba {user.username || "Kullanıcı"} </p>

        {isEditing ? (
          <>
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="profile-button"
            />
            <input
              type="email"
              value={editedEmail}
              onChange={(e) => setEditedEmail(e.target.value)}
              className="profile-button"
            />
            <button onClick={handleSave} className="profile-button">Kaydet</button>
          </>
        ) : (
          <>
            <button className="profile-button">{user.username}</button>
            <button className="profile-button">{user.email}</button>
            <button className="profile-button">********</button>
          </>
        )}

        <div className="profile-actions">
          <button className="icon-button" style={{ color: "#9f5ccc" }} onClick={onClose}>🔙</button>
          {!isEditing && (
            <button className="profile-button" onClick={() => setIsEditing(true)}> Düzenle </button>
          )}
          <IconButton onClick={handleDeleteAccount}>
            <PersonRemoveIcon style={{ color: "#9f5ccc" }} />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;

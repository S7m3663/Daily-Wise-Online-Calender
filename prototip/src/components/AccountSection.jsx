import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AccountSection.css";
import ProfileModal from "../pages/ProfileModal";


const AccountSection = () => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    navigate("/login"); 
  };

  const [user, setUser] = useState({
  name: "",
  email: ""
});

useEffect(() => {
  setUser({
    name: localStorage.getItem("username"),
    email: localStorage.getItem("email")
  });
}, []);

  return (
    <div className="account-section">
      
      <div className="account-info">
        <span className="account-name">{user.name}</span>
      </div>
      <div className="account-menu-icon" onClick={() => setShowMenu(!showMenu)}>⋮</div>

      {showMenu && (
        <div className="account-dropdown" onMouseLeave={() => setShowMenu(false)}>
          <div className="account-dropdown-item" onClick={() => { setShowMenu(false); setShowProfile(true);}}> Profil </div>    {/* değer true ise modal'ı çağırır, bileşen kapandığında yie false olur  */}
          <div className="account-dropdown-item" onClick={handleLogout}>Çıkış Yap</div>
        </div>
      )}
      {showProfile && (
        <ProfileModal
        user={user}
        onClose={() => setShowProfile(false)}
       />
)}

    </div>
    
  );
};

export default AccountSection;

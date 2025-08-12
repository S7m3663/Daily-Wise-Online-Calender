// src/components/ProtectedRoute.jsx
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../Context/UserContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(UserContext); {/* burada bir bileşen tanımladık ve 
    bu bileşen kişi yetkili ise ne yapacağını belirleyecek. 
    user eğer yok ise oturum yok sayılır. */}

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children; /* eğer user eşleştiyse gerçek sayfa render edilir. */
};

export default ProtectedRoute;
 
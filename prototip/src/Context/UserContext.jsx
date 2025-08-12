// src/context/UserContext.jsx
import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("https://daily-wise-online-calender.onrender.com/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then((res) => res.json()) /* hata fırlatmazsa her durumda datayı user'a set ettiriyor */
        .then((data) => {
          setUser(data.user);
        })
        .catch(() => {
          localStorage.clear(); 
          setUser(null);
        });
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

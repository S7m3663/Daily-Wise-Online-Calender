import { createContext, useState, useEffect } from "react";

export const PlanContext = createContext();

export const PlanProvider = ({ children }) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [plans, setPlans] = useState([]);

  // Sayfa yüklendiğinde localStorage'dan geri al
  useEffect(() => {
    const storedDay = localStorage.getItem("selectedDay");
    const storedPlans = localStorage.getItem("plans");

    if (storedDay) setSelectedDay(parseInt(storedDay));
    if (storedPlans) setPlans(JSON.parse(storedPlans));
  }, []);

  // Değişiklik olunca localStorage’a yaz
  useEffect(() => {
    if (selectedDay !== null) {
      localStorage.setItem("selectedDay", selectedDay);
    } else {
      localStorage.removeItem("selectedDay");
    }

    localStorage.setItem("plans", JSON.stringify(plans));
  }, [selectedDay, plans]);

  return (
    <PlanContext.Provider value={{ selectedDay, setSelectedDay, plans, setPlans }}>
      {children}
    </PlanContext.Provider>
  );
};

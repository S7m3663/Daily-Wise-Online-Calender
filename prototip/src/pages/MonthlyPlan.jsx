import React, { useState, useEffect } from "react";
import "./DailyPlan.css";
import "./MonthlyPlan.css"; 
import { useNavigate } from "react-router-dom";
import PlanModal from "./planModal";
import AccountSection from "../components/AccountSection";
import { PlanContext } from "../Context/PlanContext";

const tagColors = {
  "Eğlence": "purple",
  "Toplantı": "dark",
  "Aile": "gray",
  "İş": "navy",
};

const generateDays = (year, month) => {
  const date = new Date(year, month, 1);
  const days = [];

  while (date.getMonth() === month) {
    days.push({
      day: date.getDate(),
      weekday: date.getDay(),
      tag: "",
    });
    date.setDate(date.getDate() + 1);
  }

  return days;
};

const MonthlyPlan = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [days, setDays] = useState(generateDays(today.getFullYear(), today.getMonth()));
  const [selectedDay, setSelectedDay] = useState(null);
  const [plans, setPlans] = useState({});
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState("aylik");

  //  Görevleri veritabanından çek
  useEffect(() => {
    const fetchTasks = async () => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  if (!token || !userId) return;

  try {
    const res = await fetch("https://daily-wise-online-calender.onrender.com/api/tasks/list", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    if (res.ok) {
      const newPlans = {};
      const filteredTasks = data.filter(task => task.userId.toString() === userId);

      filteredTasks.forEach((task) => {
        const key = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(task.day).padStart(2, "0")}`;
        newPlans[key] = task;
      });

      setPlans(newPlans);
    } else {
      console.error("Görevleri alma hatası:", data.message);
    }
  } catch (err) {
    console.error("Sunucu hatası:", err.message);
  }
};

    fetchTasks();
  }, [currentMonth, currentYear]);

  const handleDayClick = (day) => {
    setSelectedDay(day);
  };

  const handleSave = async () => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch("https://daily-wise-online-calender.onrender.com/api/tasks/list", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    if (res.ok) {
      const updatedPlans = {};
      data.forEach((task) => {
        const key = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(task.day).padStart(2, "0")}`;
        updatedPlans[key] = task;
      });
      setPlans(updatedPlans);
    } else {
      console.error("Görevleri alırken hata:", data.message);
    }
  } catch (err) {
    console.error("Planları güncellerken hata:", err);
  }

  setSelectedDay(null); // Modalı kapat
};


  return (
    <div className="container">
      <div className={`sidebar ${isSidebarOpen ? "open" : "collapsed"}`}>
        {isSidebarOpen && (
          <>
            <div className="logo-container">
              <img src="/logo.ico" alt="logo" className="logo" />
              <h1 className="title">DailyWise</h1>
            </div>

            <div className="view-buttons">
              <button className={`button ${activeView === "gunluk" ? "active" : ""}`} onClick={() => { navigate("/gunluk"); setActiveView("gunluk"); }}>
                GÜNLÜK
              </button>
              <button className={`button ${activeView === "aylik" ? "active" : ""}`} onClick={() => { navigate("/aylik"); setActiveView("aylik"); }}>
                AYLIK
              </button>
            </div>

            <h2 className="section-title">Bugün</h2>
            <input type="date" className="date-input" value={new Date().toISOString().split("T")[0]} readOnly />

            <h2 className="section-title">Etiketlerim</h2>
            <div className="tags-box">
              <div className="tag"><span className="dot purple"></span> Eğlence</div>
              <div className="tag"><span className="dot dark"></span> Toplantı</div>
              <div className="tag"><span className="dot gray"></span> Aile</div>
              <div className="tag"><span className="dot navy"></span> İş</div>
            </div>

            <AccountSection />
          </>
        )}

        <div className="sidebar-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? "<" : ">"}
        </div>
      </div>

      <div className="main">
        <h1 className="page-title">AYLIK PLAN</h1>

        <div className="calendar-wrapper">
          <div className="calendar">
            {days.map((d) => {
              const key = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(d.day).padStart(2, "0")}`;
              const plan = plans[key];
              const colorClass = plan?.tag ? `calendar-cell ${tagColors[plan.tag]}` : "calendar-cell";

              return (
                <div
                  key={key}
                  className={colorClass}
                  onClick={() => handleDayClick(d.day)}
                >
                  {d.day}
                </div>
              );
            })}
          </div>
        </div>

        {selectedDay && (
          <PlanModal
            day={selectedDay}
            onSave={handleSave}
            onCancel={() => setSelectedDay(null)}
            plans={Object.values(plans).filter(p => p.day === selectedDay)}
            setPlans={(updatedPlansArray) => {
              if (!Array.isArray(updatedPlansArray)) {
                console.error("Beklenen array değildi:", updatedPlansArray);
                return;
              }

              const newPlanObject = {};
              updatedPlansArray.forEach((p) => {
                const key = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(p.day).padStart(2, "0")}`;
                newPlanObject[key] = p;
              });
              setPlans(newPlanObject);
            }}
            activeView={activeView}
          />
        )}
      </div>
    </div>
  );
};

export default MonthlyPlan;

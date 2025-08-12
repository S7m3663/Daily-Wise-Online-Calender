// src/pages/DailyPlan.jsx
import React, { useState, useEffect, useContext } from "react";
import "./DailyPlan.css";
import Logo from '../assets/logo/logo.ico';
import { useNavigate } from "react-router-dom";
import AccountSection from "../components/AccountSection";
import { PlanContext } from "../Context/PlanContext";

const DailyPlan = () => {
  const [showTags, setShowTags] = useState(false);
  const tagOptions = ["Eğlence", "Toplantı", "Aile", "İş"];
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("gunluk"); {/* varsayılan olarak ekran günlük planlama ekranında başlayacağı için burada da varsayılan olarak gunluk verdik. */}
  const { selectedDay, setSelectedDay, plans, setPlans } = useContext(PlanContext);

  const handleChange = (index, field, value) => {
    const updatedPlans = [...plans];
    updatedPlans[index][field] = value;
    setPlans(updatedPlans);
  };

  const addPlanRow = () => {
    setPlans([...plans, { hour: "", task: "", tag: "", note: "" }]);
  };

const deletePlan = async (indexToRemove) => {
  const planToDelete = plans[indexToRemove];
  console.log("Silinecek id:", planToDelete._id);

  if (planToDelete._id) {
    await fetch(`https://daily-wise-online-calender.onrender.com/${planToDelete._id}`, {
      method: "DELETE"
    });
  }

  const updatedPlans = plans.filter((_, index) => index !== indexToRemove);
  setPlans(updatedPlans);
};
  // En üste:
const saveTasks = async () => {
  const token = localStorage.getItem("token"); // ✅ Token alındı

  if (!token) {
    alert("Oturum süresi dolmuş. Lütfen tekrar giriş yapın.");
    return;
  }

  try {
    for (let task of plans) {
      const response = await fetch("http://localhost:5000/api/tasks/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` // ✅ Token header'a eklendi
        },
        body: JSON.stringify({
          day: new Date().toISOString().split("T")[0],
          hour: task.hour,
          task: task.task,
          tag: task.tag,
          note: task.note,
          type: "gunluk"
        })
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Görev eklenirken hata oluştu.");
      }

      task._id = result._id; // ID'yi frontend'e işle
    }

    alert("✅ Görev başarıyla kaydedildi!");
    
  } catch (err) {
    console.error("Hata:", err.message);
    alert("❌ Görev kaydı sırasında hata oluştu.");
  }
};

<button onClick={saveTasks} className="add-btn">KAYDET</button>

useEffect(() => {
  const fetchDailyPlans = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/api/tasks/list", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (res.ok) {
        const filtered = data.filter((task) => task.type === "gunluk");
        //setPlans(filtered);
      } else {
        console.error("Günlük görevler alınamadı:", data.message);
      }
    } catch (err) {
      console.error("Sunucu hatası:", err.message);
    }
  };

  fetchDailyPlans();
}, []);

  return (
    <>
  <div className="container">
    <div className={`sidebar ${isSidebarOpen ? "open" : "collapsed"}`}> {/* panel açık mı kapalı mı kontrol edilir, eğer açık değil ise en sol kenar ile birleştirir, açık
    ise panel için tanımladıklarımızı yazdırırız.  */}
  {isSidebarOpen && (
    <>
      <div className="logo-container">
        <img src="/logo.ico" alt="logo" className="logo" />
        <h1 className="title">DailyWise</h1>
      </div>

        <div className="view-buttons">
          {/*burada button'ları aktifleştirerek hangi buttona tıklanıldıysa oraa bir değişiklik yapılmasını sağlayacağız. */}
          <button
    className={`button ${activeView === "gunluk" ? "active" : ""}`}
    onClick={() => {
      navigate("/gunluk");
      setActiveView("gunluk");
    }}
  >
    GÜNLÜK
  </button>

  <button
    className={`button ${activeView === "aylik" ? "active" : ""}`}
    onClick={() => {
      navigate("/aylik");
      setActiveView("aylik");
    }}
  >
    AYLIK
  </button>
       </div>


      <h2 className="section-title">Bugün</h2>
      <input
        type="date"
        className="date-input"
        value={new Date().toISOString().split("T")[0]}
        readOnly
      />

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

{/* boolean bir state tanımladık ve mevcut değerin tersini aldık. açık kapalı durumunu değiştrdik. */}

  <div 
    className="sidebar-toggle"
    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
  >
    {/* açık ve kapalı durumlarında simgeyi değiştirdik */}
    {isSidebarOpen ? "<" : ">"}
  </div>
</div>
      <div className="main">
        <div className="header">
          <h1 className="page-title">GÜNLÜK PLAN</h1>
        </div> 

        <div className="plans">
          <div className="plan-row plan-header">
            <span>Saat</span> 
            <span>Görev</span>
            <span>Etiket</span>
            <span>Açıklama</span>
          </div>

          {plans.map((plan, index) => (
            <div className="plan-row" key={index}>
              <input type="time" value={plan.hour} onChange={(e) => handleChange(index, "hour", e.target.value)} />
              <input type="text" value={plan.task} placeholder="Görev girin" onChange={(e) => handleChange(index, "task", e.target.value)} />
              <div className="tag-select">
                <input
                  type="text"
                  value={plan.tag}
                  readOnly 
                  placeholder="Etiket seç"
                  onClick={() => setShowTags(showTags ? false : index)}
                /> {/* sadece okunması için yapılmıştır. kullanıcı sadece okuyabilir */}
                {showTags === index && (
                  <div className="tag-dropdown">
                    {tagOptions.map((tag) => ( //buradaki tagOptions her etiketi tek tek dönmesi için yazılır.
                      <div key={tag} className="tag-item" onClick={() => { handleChange(index, "tag", tag); setShowTags(false); }}>{tag}</div> //eğer tag öğesi seçilen tag öğesine eşit ise gösterimi bırakır. 
                    ))}
                  </div>
                )}
              </div>
              <input type="text" value={plan.note} placeholder="Not" onChange={(e) => handleChange(index, "note", e.target.value)} />
              <button onClick={() => deletePlan(index)} className="delete-btn">❌</button>
            </div>
          ))}

          <div className="button-group">
            <button onClick={addPlanRow} className="add-btn">+ PLAN EKLE</button>
            <button onClick={saveTasks} className="add-btn">KAYDET</button>
          </div>
          
        </div>
      </div>
    </div>
    </>
  );
}; 


export default DailyPlan;

import React, { useState, useEffect } from "react";
import './PlanModal.css';

const tagOptions = ["Eğlence", "Toplantı", "Aile", "İş"];

const PlanModal = ({ day, onSave, onCancel, plans, setPlans, activeView }) => {
  const [showTags, setShowTags] = useState(false);

  useEffect(() => {
    if (!plans || plans.length === 0) {
      setPlans([{ hour: "", task: "", tag: "", note: "", day }]);
    }
  }, [plans, day, setPlans]);

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

 const saveTasks = async () => {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  if (!token || !userId) {
    alert("Oturum süresi dolmuş. Lütfen tekrar giriş yapın.");
    return;
  }

  try {
    for (let task of plans) {
      const response = await fetch("https://daily-wise-online-calender.onrender.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          userId,
          day, 
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

      task._id = result._id;
    }

    alert("✅ Görev başarıyla kaydedildi!");
    window.location.reload();
  } catch (err) {
    console.error("Hata:", err.message);
    alert("❌ Görev kaydı sırasında hata oluştu.");
  }
};


  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{day}. Gün için Görev Ekle</h2>

        {plans && plans.map((plan, index) => (
          <div key={index} className="plan-row">
            <input
  type="time"
  value={plan.hour || ""}
  onChange={(e) => {
    const updated = [...plans];
    updated[index].hour = e.target.value;
    setPlans(updated);
  }}
/>

<input
  type="text"
  value={plan.task || ""}
  placeholder="Görev girin"
  onChange={(e) => {
    const updated = [...plans];
    updated[index].task = e.target.value;
    setPlans(updated);
  }}
/>

            <div className="tag-select">
  <input 
    type="text"
      value={plan.tag || ""}
    placeholder="Etiket seç"
    readOnly
    onClick={() => setShowTags(index)}
  />
  {showTags === index && (
    <div className="tag-dropdown">
      {tagOptions.map((t) => (
        <div
          key={t}
          className="tag-item"
          onClick={() => {
            const updated = [...plans];
            updated[index].tag = t;
            setPlans(updated);
            setShowTags(null);
          }}
        >
          {t}
        </div>
      ))}
    </div>
  )}
</div>
            <input
  type="text"
  placeholder="Not"
  value={plan.note}
  onChange={(e) => {
    const updated = [...plans];
    updated[index].note = e.target.value;
    setPlans(updated);
  }}
/>
            <button onClick={() => deletePlan(index)} className="delete-btn">❌</button>
          </div>
        ))}

        <div className="button-group">
          <button className="add-btn" onClick={saveTasks}>KAYDET</button>
          <button className="add-btn" onClick={onCancel}>İPTAL</button>
        </div>
      </div>
    </div>
  );
};

export default PlanModal;

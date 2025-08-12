const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    "https://daily-wise-online-calender.vercel.app"
  ],
  credentials: true
}));
app.use(express.json());


// ROUTES
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/User"); 

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Ana sayfa testi
app.get("/", (req, res) => {
  res.send("DailyWise Backend Çalışıyor 🚀");
});

// ✅ TEST USERS ROUTE (veritabanındaki kullanıcıları getirir)
const User = require("./models/User");

app.get("/api/dailywise-users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Veritabanı sorgu hatası" });
  }
});

// ✅ MONGODB bağlantısı
mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ MongoDB bağlantısı başarılı.");
  app.listen(PORT, () => {
    console.log(`🚀 Sunucu ${PORT} portunda çalışıyor.`);
  });
})
.catch(err => {
  console.error("❌ MongoDB bağlantı hatası:", err);
});

mongoose.connection.on('connected', () => {
  console.log("✅ MongoDB bağlantısı şu veritabanına yapıldı:", mongoose.connection.name);
});

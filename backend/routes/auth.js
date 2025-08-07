const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const User = require("../models/User");

// ✅ ME: Kullanıcıyı token ile doğrula ve bilgilerini döndür
router.get("/me", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token gerekli." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "GIZLIANAHTAR"); // .env kullanıyorsan buraya process.env.JWT_SECRET yaz
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    res.status(200).json({ user });
  } catch (err) {
    res.status(401).json({ message: "Token geçersiz.", error: err.message });
  }
});

// REGISTER
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  console.log("Yeni kayıt:", username, email);

  if (!email.includes("@") || !email.includes(".com")) {
    return res.status(400).json({ message: "Geçerli bir email girin." });
  }

  if (!username || !password) {
    return res.status(400).json({ message: "Tüm alanlar zorunlu." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Bu email zaten kayıtlı." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();
    console.log("✅ Kullanıcı MongoDB'ye kaydedildi.");

    res.status(201).json({ message: "Kayıt başarılı!" });
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası: " + err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  email = email?.toLowerCase().trim();

  try {
    const existingUser = await User.findOne({ email });
    console.log(" Gelen email:", email);
    console.log(" Bulunan kullanıcı:", existingUser);

    if (!existingUser) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    console.log(" Şifre doğru mu?", isPasswordCorrect);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Şifre hatalı." });
    }

    const token = jwt.sign(
      { userId: existingUser._id },
      "GIZLIANAHTAR",
      { expiresIn: "1d" }
    );

    res.status(200).json({
      token,
      user: {
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email
      }
    });

  } catch (err) {
    console.error("❌ Login hata:", err);
    res.status(500).json({ message: "Sunucu hatası", error: err.message });
  }
});

module.exports = router;

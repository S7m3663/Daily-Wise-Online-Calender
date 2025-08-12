const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Kullanıcı bilgilerini token ile doğrula ve döndür
router.get("/me", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token gerekli." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "GIZLIANAHTAR");
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }
    res.status(200).json({ user });
  } catch (err) {
    res.status(401).json({ message: "Token geçersiz.", error: err.message });
  }
});

// Kayıt ol (Register)
router.post("/register", async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (!email || !email.includes("@") || !email.includes(".com")) {
    return res.status(400).json({ message: "Geçerli bir email girin." });
  }
  if (!username || !password || !confirmPassword) {
    return res.status(400).json({ message: "Tüm alanlar zorunlu." });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Şifreler eşleşmiyor." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Bu email zaten kayıtlı." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email: email.trim().toLowerCase(),
      password: hashedPassword
    });

    await newUser.save();
    res.status(201).json({ message: "Kayıt başarılı!" });
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası: " + err.message });
  }
});

// Giriş yap (Login)
router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  email = email?.toLowerCase().trim();

  if (!email || !password) {
    return res.status(400).json({ message: "Email ve şifre zorunlu." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Şifre hatalı." });
    }

    const token = jwt.sign(
      { userId: existingUser._id },
      process.env.JWT_SECRET || "GIZLIANAHTAR",
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
    res.status(500).json({ message: "Sunucu hatası", error: err.message });
  }
});

module.exports = router;
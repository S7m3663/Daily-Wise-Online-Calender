// routes/user.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Kullanıcı silme
router.delete("/:id", async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id); // Düzeltildi: değişken adı
        if (!deletedUser) {
            return res.status(404).json({ error: "Kullanıcı bulunamadı" }); // Düzeltildi: mesaj
        }
        res.status(200).json({ message: "Kullanıcı silindi" }); // Düzeltildi: mesaj
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}); 

router.put("/:id", async (req, res) => {
  try {
    const updates = {};
    if (req.body.username) updates.username = req.body.username;
    if (req.body.email) updates.email = req.body.email;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


module.exports = router;

const express = require("express");
const router = express.Router();
const { createTask, getAllTasks, deleteTask, getTasksByDay } = require("../controls/taskControls");
const authenticate = require("../middleware/authenticate");

// CREATE
router.post("/add", authenticate, createTask);

// LIST ALL
router.get("/list", authenticate, getAllTasks);

// ✅ 1) Query ile gün bazlı listeyi destekle: /api/tasks/by-day?day=2025-08-12
router.get("/by-day", authenticate, (req, res, next) => {
  if (!req.query.day) return res.status(400).json({ message: "day query parametresi gerekli." });
  // normalize: controller hep req.params.day beklesin
  req.params.day = req.query.day;
  return getTasksByDay(req, res, next);
});

// ✅ 2) Path param ile gün bazlı liste: /api/tasks/by-day/:day
router.get("/by-day/:day", authenticate, getTasksByDay);

// ✅ 3) Silme için alias ekle: /api/tasks/delete/:id
//    Bu route'u GENEL '/:id' route'undan ÖNCE yaz!
router.delete("/delete/:id", authenticate, deleteTask);

// Var olan: /api/tasks/:id
router.delete("/:id", authenticate, deleteTask);

router.use("*", (req, res) => {
  res.status(404).json({ error: "Tasks route not found", path: req.originalUrl });
});

module.exports = router;

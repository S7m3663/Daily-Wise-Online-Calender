const express = require("express");
const router = express.Router();
const { createTask, getAllTasks, deleteTask, getTasksByDay } = require("../controls/taskControls");
const authenticate = require("../middleware/authenticate"); // ✅ JWT kontrolü için middleware

router.post("/add", authenticate, createTask);
router.get("/list", authenticate, getAllTasks);
router.get("/by-day/:day", authenticate, getTasksByDay);
router.delete("/:id", authenticate, deleteTask);

module.exports = router;


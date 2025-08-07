const Task = require("../models/Task");


// Task oluştur
const createTask = async (req, res) => {
  try {
    const { day, hour, task, tag, note } = req.body;

    const newTask = new Task({
      day,
      hour,
      task,
      tag,
      note,
      userId: req.user.userId // ✅ Token'dan gelen userId
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Tüm task’ları getir
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.userId }); 
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Task siler
const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Görev silindi" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Gün bazlı görevleri getirir
const getTasksByDay = async (req, res) => {
  try {
    const { day } = req.params;
    const tasks = await Task.find({
      day,
      userId: req.user.userId // sadece bu kullanıcının bu günkü görevleri
    });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = { createTask, getAllTasks, deleteTask, getTasksByDay };

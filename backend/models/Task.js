const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  day: { type: String, required: true },
  hour: { type: String, required: true },
  task: { type: String, required: true },
  tag: { type: String },
  note: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } 
});

module.exports = mongoose.model("Task", TaskSchema);

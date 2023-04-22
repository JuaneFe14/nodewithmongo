const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TaskSchema = Schema({
  title: String,
  description: String,
  deadline: String,
  status: {
    type: Boolean,
    default: false,
  },
  createin: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("tasks", TaskSchema);

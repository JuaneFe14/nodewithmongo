const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UsersSchema = Schema({
  name: String,
  username: String,
  password: String,
  role: {
    type: Number,
    default: 1,
  },
});

module.exports = mongoose.model("users", UsersSchema);

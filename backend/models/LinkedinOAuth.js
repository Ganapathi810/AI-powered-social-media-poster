// models/TwitterOAuth.js
const mongoose = require("mongoose");

const LinkedinOAuthSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  state: String// auto-delete after 5 mins
});

module.exports = mongoose.model("LinkedinOAuth", LinkedinOAuthSchema);

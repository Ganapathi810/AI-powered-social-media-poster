// models/TwitterOAuth.js
const mongoose = require("mongoose");

const twitterOAuthSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  state: { type: String, required: true },
  codeVerifier: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 } // auto-delete after 5 mins
});

module.exports = mongoose.model("TwitterOAuth", twitterOAuthSchema);

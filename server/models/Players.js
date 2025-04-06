const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  elo: { type: Number, default: 45 },
  isAdmin: { type: Boolean, default: false },
});

module.exports = mongoose.model('Player', PlayerSchema);

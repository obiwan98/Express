// models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  signupDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);

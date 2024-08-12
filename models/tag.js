// models/aladinCategory.js
const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  Code: { type: String, required: true },
  Name: { type: String, required: true }
});

module.exports = mongoose.model('Tag', tagSchema);
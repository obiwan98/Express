// models/book.js
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  cover : { type: String, required: false },
  link : { type: String, required: false },
  author: { type: String, required: true },
  categoryName: { type: String, required: false },
  publisher: { type: String, required: true },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  registDate: { type: Date, default: Date.now },
  count: { type: Number, default: 0 },
});

module.exports = mongoose.model('Book', bookSchema);

// models/management.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  rate: { type: Number, default: 0 },
  tag: { type: Number, required: true },
  comment: { type: String, required: true },
  registrationDate: { type: Date, default: Date.now },
  registeredBy: { type: String, required: true },
});

const managementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: false },
  cover: { type: String, required: false },
  publisher: { type: String, required: false },
  publicationDate: { type: Date, default: Date.now },
  count: { type: Number, default: 1 },
  review: [reviewSchema],
  registrationDate: { type: Date, default: Date.now },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  registeredBy: { type: String, required: true },
});

module.exports = mongoose.model('Management', managementSchema, 'bookList');

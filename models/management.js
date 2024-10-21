// models/management.js
const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  state: { type: Number, default: 1 },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  registeredBy: { type: String, required: true },
});

const reviewsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  rate: { type: Number, default: 0, min: 0, max: 5 },
  tag: { type: Number, required: true },
  comment: { type: String, required: true },
  registrationDate: { type: Date, default: Date.now },
  registeredBy: { type: String, required: true },
});

const managementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  link: { type: String, required: false },
  description: { type: String, required: false },
  author: { type: String, required: false },
  coverUrl: { type: String, required: false },
  coverFile: { type: String, required: false },
  isbn: { type: String, required: false },
  publisher: { type: String, required: false },
  publicationDate: { type: Date, default: Date.now },
  count: { type: Number, default: 1 },
  rentalCount: { type: Number, default: 0 },
  history: [historySchema],
  reviews: [reviewsSchema],
  registrationDate: { type: Date, default: Date.now },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  registeredBy: { type: String, required: true },
});

module.exports = mongoose.model('Management', managementSchema, 'bookList');

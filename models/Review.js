"use strict";

const mongoose = require("mongoose");
const { Schema } = mongoose;

const ReviewSchema = new Schema({
  product: { type: String, required: true },
  authorId: { type: mongoose.Types.ObjectId, required: true },
  author: { type: String, required: true },
  rating: { type: String, required: true },
  description: { type: String, required: true },
  approved: { type: Boolean, default: false },
  date: { type: Date, default: Date.now() }
});

module.exports = mongoose.model("Review", ReviewSchema);

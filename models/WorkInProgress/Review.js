"use strict";

const mongoose = require("mongoose");
const { Schema } = mongoose;

const ReviewSchema = new Schema({
  product: { type: String, required: true },
  author: { type: String, required: true },
  rating: { type: Number, required: true },
  description: { type: String, required: true },
  approved: { type: Boolean, default: false }
});

module.exports = mongoose.model("Review", ReviewSchema);

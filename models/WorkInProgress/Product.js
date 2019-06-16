"use strict";

const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProductSchema = new Schema({
  name: { type: String, required: true },
  rating: { type: Number, default: 0 },
  description: { type: String, required: true },
  price: { type: String, required: true }
});

module.exports = mongoose.model("Product", ProductSchema);

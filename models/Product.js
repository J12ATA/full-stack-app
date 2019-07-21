"use strict";

const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProductSchema = new Schema({
  name: { type: String, required: true },
  rating: { type: Number, default: 0 },
  description: { type: String, required: true },
  price: { type: String, required: true }
}, { toJSON: { virtuals: true }, id: false });

ProductSchema.virtual("reviews", {
  ref: "Review",
  localField: "name",
  foreignField: "product",
  justOne: false
});

ProductSchema.virtual("reviewsCount", {
  ref: "Review",
  localField: "name",
  foreignField: "product",
  count: true
});

module.exports = mongoose.model("Product", ProductSchema);

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
  ref: "Review", // Use the Review model
  localField: "name", // Find reviews where 'localField'
  foreignField: "product", // is equal to 'foreignField'
  justOne: false // true ? single doc : an array of docs
});

module.exports = mongoose.model("Product", ProductSchema);

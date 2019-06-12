const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ProductSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 0
  },
  reviews: {
    type: Array,
    default: []
  }
});

module.exports = Product = mongoose.model("products", ProductSchema);

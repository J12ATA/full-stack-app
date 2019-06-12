const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Child Schema
const ProductReviewSchema = new Schema({
  author: {
    type: String,
    required: true
  },
  product: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

// Create Parent Schema
const ReviewerSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  verified: {
    type: Boolean,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  reviews: {
    type: Array,
    value: ProductReviewSchema
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Reviewer = mongoose.model("reviewers", ReviewerSchema);

"use strict";

const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }
}, { toJSON: { virtuals: true }, id: false });

UserSchema.virtual("reviews", {
  ref: "Review", // Use the Review model
  localField: "name", // Find reviews where 'localField'
  foreignField: "author", // is equal to 'foreignField'
  justOne: false // true ? single doc : an array of docs
});

module.exports = mongoose.model("User", UserSchema);

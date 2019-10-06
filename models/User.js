
const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  { toJSON: { virtuals: true }, id: false },
);

UserSchema.virtual('reviews', {
  ref: 'Review',
  localField: 'name',
  foreignField: 'author',
  justOne: false,
});

UserSchema.virtual('reviewsCount', {
  ref: 'Review',
  localField: 'name',
  foreignField: 'author',
  count: true,
});

module.exports = mongoose.model('User', UserSchema);

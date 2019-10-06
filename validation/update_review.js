/* eslint-disable no-param-reassign */

const Validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validateUpdateReviewInput(data) {
  const errors = {};

  data.rating = !isEmpty(data.rating) ? data.rating : '';
  data.description = !isEmpty(data.description) ? data.description : '';
  data.approved = !isEmpty(data.approved) ? data.approved : '';

  if (!Validator.isEmpty(data.rating)) {
    if (!Validator.isInt(data.rating, { gt: 0, lt: 6 })) {
      errors.rating = 'rating must be within range 1-5';
    }
  }

  if (!Validator.isEmpty(data.description)) {
    if (!Validator.isLength(data.description, { min: 10, max: undefined })) {
      errors.description = 'description must be at least 10 characters';
    }
  }

  if (!Validator.isEmpty(data.approved)) {
    if (!Validator.isBoolean(data.approved)) {
      errors.approved = 'approved field must be true or false';
    }
  }

  return { errors, isValid: isEmpty(errors) };
};

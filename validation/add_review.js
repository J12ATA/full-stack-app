'use strict';

const Validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validateAddReviewInput(data) {
  const errors = {};

  data.product = !isEmpty(data.product) ? data.product : '';
  data.rating = !isEmpty(data.rating) ? data.rating : '';
  data.description = !isEmpty(data.description) ? data.description : '';
  data.authorId = !isEmpty(data.authorId) ? data.authorId : '';
  data.author = !isEmpty(data.author) ? data.author : '';

  if (Validator.isEmpty(data.product)) {
    errors.product = 'product field is required';
  }

  if (Validator.isEmpty(data.rating)) {
    errors.rating = 'rating field is required';
  } else if (!Validator.isInt(data.rating, {gt: 0, lt: 6})) {
    errors.rating = 'rating must be within range 1-5';
  }

  if (Validator.isEmpty(data.description)) {
    errors.description = 'description field is required';
  } else if (
    !Validator.isLength(data.description, {min: 10, max: undefined})
  ) {
    errors.description = 'description must be at least 10 characters';
  }

  if (Validator.isEmpty(data.author)) {
    errors.author = 'author field is required';
  }

  if (Validator.isEmpty(data.authorId)) {
    error.authorId = 'authorId field is required';
  }

  return {errors, isValid: isEmpty(errors)};
};

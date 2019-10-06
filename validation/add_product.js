/* eslint-disable no-param-reassign */


const Validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validateAddProductInput(data) {
  const errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.description = !isEmpty(data.description) ? data.description : '';
  data.price = !isEmpty(data.price) ? data.price : '';

  if (Validator.isEmpty(data.name)) {
    errors.name = 'name field is required';
  }

  if (Validator.isEmpty(data.description)) {
    errors.description = 'description field is required';
  } else if (
    !Validator.isLength(data.description, { min: 10, max: undefined })
  ) {
    errors.description = 'description must be at least 10 characters';
  }

  if (Validator.isEmpty(data.price)) {
    errors.price = 'price field is required';
  } else if (!Validator.isCurrency(data.price)) {
    errors.price = 'valid price format: $2.99';
  }

  return { errors, isValid: isEmpty(errors) };
};

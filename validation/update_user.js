'use strict';

const Validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validateUpdateUserInput(data) {
  const errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.password2 = !isEmpty(data.password2) ? data.password2 : '';

  if (!Validator.isEmpty(data.email)) {
    if (!Validator.isEmail(data.email)) {
      errors.email = 'email is invalid';
    }
  }

  if (!Validator.isEmpty(data.password)) {
    if (Validator.isEmpty(data.password2)) {
      errors.password2 = 'please confirm password';
    } else {
      if (!Validator.equals(data.password, data.password2)) {
        errors.password = 'passwords must match';
        errors.password2 = 'passwords must match';
      }
      if (!Validator.isLength(data.password, {min: 6, max: 30})) {
        errors.password = 'Password must be at least 6 characters';
      }
    }
  }

  return {errors, isValid: isEmpty(errors)};
};

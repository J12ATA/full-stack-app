"use strict";

const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateUpdateProductInput(data) {
  let errors = {};

  data.price = !isEmpty(data.price) ? data.price : "";
  data.description = !isEmpty(data.description) ? data.description : "";

  if (!Validator.isEmpty(data.price)) {
    if (!Validator.isCurrency(data.price)) {
      errors.price = "valid price format: $2.99";
    }
  }

  if (!Validator.isEmpty(data.description)) {
    if (!Validator.isLength(data.description, { min: 10, max: undefined })) {
      errors.description = "description must be at least 10 characters";
    }
  }

  return { errors, isValid: isEmpty(errors) };
};

"use strict";

const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateUpdateProductInput(data) {
  let errors = "";

  // Convert empty fields to an empty string so we can use validator functions
  data.price = !isEmpty(data.price) ? data.price : "";
  data.description = !isEmpty(data.description) ? data.description : "";

  // Price checks
  if (!Validator.isEmpty(data.price)) {
    if (!Validator.isCurrency(data.price)) {
      errors += "Price is invalid, Example: $2.99. ";
    }
  }

  // Description checks
  if (!Validator.isEmpty(data.description)) {
    if (!Validator.isLength(data.description, { min: 10, max: undefined })) {
      errors += "Description must be at least 10 characters. ";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

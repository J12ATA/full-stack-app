"use strict";

const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateUpdateReviewInput(data) {
  let errors = "";

  // Convert empty fields to an empty string so we can use validator functions
  data.rating = !isEmpty(data.rating) ? data.rating : "";
  data.description = !isEmpty(data.description) ? data.description : "";
  data.approved = !isEmpty(data.approved) ? data.approved : "";

  // Rating checks
  if (!Validator.isEmpty(data.rating)) {
    if (!Validator.isInt(data.rating, { gt: 0, lt: 6 })) {
      errors += "Rating must be within range 1-5. ";
    }
  }

  // Description checks
  if (!Validator.isEmpty(data.description)) {
    if (!Validator.isLength(data.description, { min: 10, max: undefined })) {
      errors += "Description must be at least 10 characters. ";
    }
  }

  // Approved checks
  if (!Validator.isEmpty(data.approved)) {
    if (!Validator.isBoolean(data.approved)) {
      errors += "Approved field must be true or false. ";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

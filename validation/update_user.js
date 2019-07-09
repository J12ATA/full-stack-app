"use strict";

const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateUpdateUserInput(data) {
  let errors = "";

  // Convert empty fields to an empty string so we can use validator functions
  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  // Email check
  if (!Validator.isEmpty(data.email)) {
    if (!Validator.isEmail(data.email)) {
      errors += "Email is invalid. ";
    }
  }

  // Password checks
  if (!Validator.isEmpty(data.password)) {
    if (Validator.isEmpty(data.password2)) {
      errors += "Confirm password field is required";
    } else {
      if (!Validator.equals(data.password, data.password2)) {
        errors += "Passwords must match";
      }
      if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
        errors += "Password must be at least 6 characters";
      }
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

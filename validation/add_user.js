"use strict";

const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateAddUserInput(data) {
  let errors = "";

  // Convert empty fields to an empty string so we can use validator functions
  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  // Name checks
  if (Validator.isEmpty(data.name)) {
    errors += "Name field is required. ";
  }

  // Email checks
  if (Validator.isEmpty(data.email)) {
    errors += "Email field is required. ";
  } else if (!Validator.isEmail(data.email)) {
    errors += "Email is invalid. ";
  }

  // Password checks
  if (Validator.isEmpty(data.password) && Validator.isEmpty(data.password2)) {
    errors += "Password fields are required. ";
  } else {
    if (Validator.isEmpty(data.password)) {
      errors += "Password field is required. ";
    }
    if (Validator.isEmpty(data.password2)) {
      errors += "Confirm password field is required. ";
    }
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors += "Password must be at least 6 characters. ";
  }

  if (!Validator.isEmpty(data.password2) && !Validator.isEmpty(data.password)) {
    if (!Validator.equals(data.password, data.password2)) {
      errors += "Passwords must match. ";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

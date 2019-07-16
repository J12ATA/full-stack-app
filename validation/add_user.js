"use strict";

const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateAddUserInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  if (Validator.isEmpty(data.name)) {
    errors.name = "name field is required";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "email field is required";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "email is invalid";
  }

  if (Validator.isEmpty(data.password) && Validator.isEmpty(data.password2)) {
    errors.password = "password fields are required";
    errors.password2 = "password fields are required";
  } else {
    if (Validator.isEmpty(data.password)) {
      errors.password = "password field is required";
    }
    if (Validator.isEmpty(data.password2)) {
      errors.password2 = "please confirm password";
    }
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "password must be at least 6 characters";
  }

  if (!Validator.isEmpty(data.password2) && !Validator.isEmpty(data.password)) {
    if (!Validator.equals(data.password, data.password2)) {
      errors.password = "passwords must match";
      errors.password2 = "passwords must match";
    }
  }

  return { errors, isValid: isEmpty(errors) };
};

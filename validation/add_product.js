const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateAddProductInput(data) {
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.name = !isEmpty(data.name) ? data.name : "";
  data.description = !isEmpty(data.description) ? data.description : "";
  data.price = !isEmpty(data.price) ? data.price : "";

  // Name checks
  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }

  // Description checks
  if (Validator.isEmpty(data.description)) {
    errors.description = "Description field is required";
  } else if (
    !Validator.isLength(data.description, { min: 10, max: undefined })
  ) {
    errors.description = "Description must be at least 10 characters";
  }

  // Price checks
  if (Validator.isEmpty(data.price)) {
    errors.price = "Price field is required";
  }
  if (!Validator.isCurrency(data.price)) {
    errors.price = "Price is invalid, Example: $2.99";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

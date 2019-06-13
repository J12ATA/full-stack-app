const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateAddProductReviewInput(data) {
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.name = !isEmpty(data.name) ? data.name : "";
  data.product = !isEmpty(data.product) ? data.product : "";
  data.rating = !isEmpty(data.rating) ? data.rating : "";
  data.description = !isEmpty(data.description) ? data.description : "";

  // Name checks
  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }

  // Product checks
  if (Validator.isEmpty(data.product)) {
    errors.product = "Product field is required";
  }
  
  // Rating checks
  if (Validator.isEmpty(data.rating)) {
    errors.rating = "Rating field is required";
  }
  if (!Validator.isInt(data.rating, {gt: 0, lt: 6})) {
    errors.rating = "Rating must be within range 1-5";
  }

  // Description checks
  if (Validator.isEmpty(data.description)) {
    errors.description = "Description field is required";
  } else if (
    !Validator.isLength(data.description, { min: 10, max: undefined })
  ) {
    errors.description = "Description must be at least 10 characters";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

"use strict";

const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateAddReviewInput(data) {
  let errors = "";

  // Convert empty fields to an empty string so we can use validator functions
  data.product = !isEmpty(data.product) ? data.product : "";
  data.rating = !isEmpty(data.rating) ? data.rating : "";
  data.description = !isEmpty(data.description) ? data.description : "";
  data.authorId = !isEmpty(data.authorId) ? data.authorId : "";
  data.author = !isEmpty(data.author) ? data.author : "";

  // Product checks
  if (Validator.isEmpty(data.product)) {
    errors += "product field is required. ";
  }

  // Rating checks
  if (Validator.isEmpty(data.rating)) {
    errors += "rating field is required. ";
  } else if (!Validator.isInt(data.rating, { gt: 0, lt: 6 })) {
    errors += "rating must be within range 1-5. ";
  }

  // Description checks
  if (Validator.isEmpty(data.description)) {
    errors += "description field is required. ";
  } else if (
    !Validator.isLength(data.description, { min: 10, max: undefined })
  ) {
    errors += "description must be at least 10 characters. ";
  }

  // Author checks
  if (Validator.isEmpty(data.author)) {
    errors += "author field is required. ";
  }  
  
  // AuthorId checks
  if (Validator.isEmpty(data.authorId)) {
    errors += "authorId field is required. ";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

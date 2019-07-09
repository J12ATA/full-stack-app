'use strict'

const express = require("express");
const router = express.Router();

// Load reviewController and destructure it's methods
const { add_review, get_all_reviews, get_review, update_review, delete_review } = require("../controllers/reviewController");

// @route POST api/reviews/add_review
router.post("/add_review", add_review);

// @route GET api/reviews/get_all_reviews
router.get("/get_all_reviews", get_all_reviews);

// @route GET api/reviews/:_id
router.get("/:_id", get_review);

// @route PUT api/reviews/:_id
router.put("/:_id", update_review);

// @route DELETE api/reviews/:_id
router.delete("/:_id", delete_review);

module.exports = router;
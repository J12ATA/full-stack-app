'use strict';

const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();

// Load reviewController and destructure it's methods
const {
  addReview,
  getAllReviews,
  getReview,
  updateReview,
  deleteReview,
} = require('../controllers/reviewController');

// @route POST api/reviews/add_review
router.post('/add_review', addReview);

// @route GET api/reviews/get_all_reviews
router.get('/get_all_reviews', getAllReviews);

// @route GET api/reviews/:_id
router.get('/:_id', getReview);

// @route PUT api/reviews/:_id
router.put('/:_id', updateReview);

// @route DELETE api/reviews/:_id
router.delete('/:_id', deleteReview);

module.exports = router;

"use strict";

// Load input validation
const validateAddReviewInput = require("../validation/add_review");
const validateUpdateReviewInput = require("../validation/update_review");

// Load Review model
const Review = require("../models/Review");
// Load Product model
const Product = require("../models/Product");

exports.add_review = async (req, res, next) => {
  const input = req.body;
  // Form validation
  const { errors, isValid } = validateAddReviewInput(input);
  // Check validation
  if (!isValid) {
    const err = new Error(`Bad Request: ${errors}`);
    err.status = 400;
    return next(err);
  }
  const newReview = new Review(input);
  newReview.save().then(review => 
    res.status(201).json({ message: "Success!", reviewId: review._id })
  ).catch(err => next(err));
};

exports.get_all_reviews = async (req, res, next) => {
  Review.find({}, "-__v").then(reviews => 
    res.status(200).json(reviews)
  ).catch(err => next(err));
};

exports.get_review = async (req, res, next) => {
  const { _id } = req.params;
  Review.findById(_id, "-__v").then(review => {
    if (!review) {
      const err = new Error(`Bad Request: No review found with _id ${_id}`);
      err.status = 400;
      next(err);
    } else {
      return res.status(200).json(review);
    }
  }).catch(err => next(err));
};

exports.update_review = async (req, res, next) => {
  const update = req.body;
  const { _id } = req.params;
  const { errors, isValid } = validateUpdateReviewInput(update);
  // Check validation
  if (!isValid) {
    const err = new Error(`Bad Request: ${errors}`);
    err.status = 400;
    return next(err);
  }
  if (update._id) {
    const err = new Error("Update failed, cannot update field: _id");
    err.status = 400;
    return next(err);
  } else {
    Review.findById(_id).then(review => {
      if (!review) {
        const err = new Error(`Update failed, no review found with _id: ${_id}`);
        err.status = 400;
        return next(err);
      } else {
        Product.findOne({ name: review.product }).populate("reviews", "rating approved").then(product => {
          let ratings = [];
      
          if (update.approved === true) {
            ratings.push([ Number(update.rating), Number(update.rating) ]);
          }
      
          product.reviews.map(review => {
            if (review.approved === true) { 
              ratings.push([ Number(review.rating), Number(review.rating) ])
            }
          });
      
          const weightedMean = arr => {
            let totalWeight = arr.reduce((acc, curr) => {
              return acc + curr[1];
            }, 0);
            return arr.reduce((acc, curr) => {
              return acc + (curr[0] * curr[1]) / totalWeight;
            }, 0);
          };
      
          product.rating = weightedMean(ratings).toFixed(1);
      
          product.save();
        }).catch(err => next(err));
      }
    }).catch(err => next(err));

    Review.findByIdAndUpdate(_id, update).then(() => 
      res.status(200).json({ message: "Success!" })
    ).catch(err => next(err));
  }
};

exports.delete_review = async (req, res, next) => {
  const { _id } = req.params;
  Review.findByIdAndRemove(_id).then(deletedReview => {
    if (!deletedReview) {
      const err = new Error(`No review found with _id: ${_id}`);
      err.status = 400;
      next(err);
    } else {
      return res.status(200).json({
        message: "Success!",
        deleted: deletedReview._id
      });
    }
  }).catch(err => next(err));
};

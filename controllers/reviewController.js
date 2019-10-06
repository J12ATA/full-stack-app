/* eslint-disable no-shadow */
/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */


const validateAddReviewInput = require('../validation/add_review');
const validateUpdateReviewInput = require('../validation/update_review');

const Review = require('../models/Review');
const Product = require('../models/Product');

exports.addReview = async (req, res, next) => {
  const input = req.body;
  const { errors, isValid } = validateAddReviewInput(input);

  if (!isValid) {
    const err = {};
    err.errors = errors;
    err.status = 400;
    return next(err);
  }

  const newReview = new Review(input);

  return newReview
    .save()
    .then((review) => res.status(201).json({ message: 'Success!', reviewId: review._id }))
    .catch((err) => next(err));
};

exports.getAllReviews = async (req, res, next) => {
  const options = '-__v';
  Review.find({}, options)
    .then((reviews) => res.status(200).json(reviews))
    .catch((err) => next(err));
};

exports.getReview = async (req, res, next) => {
  const { _id } = req.params;
  const options = '-__v';

  return Review.findById(_id, options)
    .then((review) => {
      if (!review) {
        const err = {};
        err.errors = { _id: `No review found with _id ${_id}` };
        err.status = 400;
        return next(err);
      }
      return res.status(200).json(review);
    })
    .catch((err) => next(err));
};

exports.updateReview = async (req, res, next) => {
  const update = req.body;
  const { _id } = req.params;
  const { errors, isValid } = validateUpdateReviewInput(update);

  if (!isValid) {
    const err = {};
    err.errors = errors;
    err.status = 400;
    return next(err);
  }

  if (update._id) {
    const err = {};
    err.errors = { _id: 'Update failed, cannot update field: _id' };
    err.status = 400;
    return next(err);
  }

  Review.findById(_id)
    .then((review) => {
      if (!review) {
        const err = {};
        err.errors = {
          _id: `Update failed, no review found with _id: ${_id}`,
        };
        err.status = 400;
        return next(err);
      }
      const field1 = 'reviews';
      const field2 = 'reviewsCount';
      const select = 'rating approved';

      return Product.findOne({ name: review.product })
        .populate(field1, select)
        .populate(field2)
        .then((product) => {
          const ratings = [];

          if (update.approved === true) {
            ratings.push([Number(update.rating), Number(update.rating)]);
          }

          product.reviews.map((review) => {
            if (review.approved === true) {
              ratings.push([Number(review.rating), Number(review.rating)]);
            }

            return ratings;
          });

          const weightedMean = (arr) => {
            const totalWeight = arr.reduce((acc, curr) => acc + curr[1], 0);
            return arr.reduce((acc, curr) => acc + (curr[0] * curr[1]) / totalWeight, 0);
          };

          // eslint-disable-next-line no-param-reassign
          product.rating = weightedMean(ratings).toFixed(1);

          return product.save();
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));

  return Review.findByIdAndUpdate(_id, update)
    .then(() => res.status(200).json({ message: 'Success!' }))
    .catch((err) => next(err));
};

exports.deleteReview = async (req, res, next) => {
  const { _id } = req.params;

  return Review.findByIdAndRemove(_id)
    .then((deletedReview) => {
      if (!deletedReview) {
        const err = {};
        err.errors = { _id: `No review found with _id: ${_id}` };
        err.status = 400;
        return next(err);
      }
      return res.status(200).json({
        message: 'Success!',
        deleted: deletedReview._id,
      });
    })
    .catch((err) => next(err));
};

'use strict';

// Load input validation
const validateAddProductInput = require('../validation/add_product');
const validateUpdateProductInput = require('../validation/update_product');

// Load Product model
const Product = require('../models/Product');

exports.addProduct = async (req, res, next) => {
  const input = req.body;
  const {errors, isValid} = validateAddProductInput(input);

  if (!isValid) {
    const err = {};
    err.errors = errors;
    err.status = 400;
    return next(err);
  }

  const newProduct = new Product(input);
  newProduct
      .save()
      .then((product) =>
        res.status(201).json({message: 'Success!', productId: product._id})
      )
      .catch((err) => next(err));
};

exports.getAllProducts = async (req, res, next) => {
  const [options, select] = '-__v';
  const field1 = 'reviews';
  const field2 = 'reviewsCount';
  Product.find({}, options)
      .populate(field1, select)
      .populate(field2)
      .then((products) => res.status(200).json(products))
      .catch((err) => next(err));
};

exports.getProduct = async (req, res, next) => {
  const {_id} = req.params;
  const [options, select] = '-__v';
  const field1 = 'reviews';
  const field2 = 'reviewsCount';
  Product.findById(_id, options)
      .populate(field1, select)
      .populate(field2)
      .then((product) => {
        if (!product) {
          const err = {};
          err.errors = {_id: `No product found with _id ${_id}`};
          err.status = 400;
          return next(err);
        } else {
          res.status(200).json(product);
        }
      })
      .catch((err) => next(err));
};

exports.updateProduct = async (req, res, next) => {
  const update = req.body;
  const {_id} = req.params;
  const {errors, isValid} = validateUpdateProductInput(update);
  // Check validation
  if (!isValid) {
    const err = {};
    err.errors = errors;
    err.status = 400;
    return next(err);
  }
  if (update._id) {
    const err = {};
    err.errors = {_id: 'Update failed, cannot update field: _id'};
    err.status = 400;
    return next(err);
  } else {
    Product.findByIdAndUpdate(_id, update)
        .then((updated) => {
          if (!updated) {
            const err = {};
            err.errors = {
              _id: `Update failed, no review found with _id: ${_id}`,
            };
            err.status = 400;
            return next(err);
          } else {
            res.status(200).json({message: 'Success!'});
          }
        })
        .catch((err) => next(err));
  }
};

exports.deleteProduct = async (req, res, next) => {
  const {_id} = req.params;
  Product.findByIdAndRemove(_id)
      .then((deletedProduct) => {
        if (!deletedProduct) {
          const err = {};
          err.errors = {_id: `No product found with _id: ${_id}`};
          err.status = 400;
          return next(err);
        } else {
          res.status(200).json({
            message: 'Success!',
            deleted: deletedProduct._id,
          });
        }
      })
      .catch((err) => next(err));
};

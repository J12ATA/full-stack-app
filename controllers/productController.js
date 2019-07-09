"use strict";

// Load input validation
const validateAddProductInput = require("../validation/add_product");
const validateUpdateProductInput = require("../validation/update_product");

// Load Product model
const Product = require("../models/Product");

exports.add_product = async (req, res, next) => {
  const input = req.body;
  // Form validation
  const { errors, isValid } = validateAddProductInput(input);
  // Check validation
  if (!isValid) {
    const err = new Error(`Bad Request: ${errors}`);
    err.status = 400;
    return next(err);
  }
  const newProduct = new Product(input);
  newProduct.save().then(product =>
    res.status(201).json({ message: "Success!", productId: product._id })
  ).catch(err => next(err));
};

exports.get_all_products = async (req, res, next) => {
  Product.find({}, "-__v")
    .populate("reviews", "-__v")
    .then(products => res.status(200).json(products))
    .catch(err => next(err));
};

exports.get_product = async (req, res, next) => {
  const { _id } = req.params;
  Product.findById(_id, "-__v").populate("reviews", "-__v").then(product => {
    if (!product) {
      const err = new Error(`Bad Request: No product found with _id ${_id}`);
      err.status = 400;
      next(err);
    } else {
      return res.status(200).json(product);
    }
  }).catch(err => next(err));
};

exports.update_product = async (req, res, next) => {
  const update = req.body;
  const { _id } = req.params;
  const { errors, isValid } = validateUpdateProductInput(update);
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
    Product.findByIdAndUpdate(_id, update).then(updated => {
      if (!updated) {
        const err = new Error(`Update failed, no review found with _id: ${_id}`);
        err.status = 400;
        return next(err);
      } else {
        return res.status(200).json({ message: "Success!" })
      }
    }).catch(err => next(err));
  }
};

exports.delete_product = async (req, res, next) => {
  const { _id } = req.params;
  Product.findByIdAndRemove(_id).then(deletedProduct => {
    if (!deletedProduct) {
      const err = new Error(`No product found with _id: ${_id}`);
      err.status = 400;
      next(err);
    } else {
      return res.status(200).json({
        message: "Success!",
        deleted: deletedProduct._id
      });
    }
  }).catch(err => next(err));
};

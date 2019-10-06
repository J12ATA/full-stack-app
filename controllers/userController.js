'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

const validateAddUserInput = require('../validation/add_user');
const validateLoginInput = require('../validation/login');
const validateUpdateUserInput = require('../validation/update_user');

const User = require('../models/User');

exports.addUser = async (req, res, next) => {
  const input = req.body;
  const {errors, isValid} = validateAddUserInput(input);

  if (!isValid) {
    const err = {};
    err.errors = errors;
    err.status = 400;
    return next(err);
  }

  const newUser = new User(input);

  bcrypt.genSalt(10, (err, salt) => {
    if (err) next(err);
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) next(err);
      newUser.password = hash;
      newUser
          .save()
          .then((user) =>
            res.status(201).json({
              message: 'Success!',
              userId: user._id,
            })
          )
          .catch((err) => next(err));
    });
  });
};

exports.loginUser = async (req, res, next) => {
  const input = req.body;
  const {email, password} = input;
  const {errors, isValid} = validateLoginInput(input);

  if (!isValid) {
    const err = {};
    err.errors = errors;
    err.status = 400;
    return next(err);
  }

  User.findOne({email})
      .then((user) => {
        if (!user) {
          const err = {};
          err.errors = {email: 'email not found'};
          err.status = 404;
          return next(err);
        } else {
          bcrypt
              .compare(password, user.password)
              .then((isMatch) => {
                if (isMatch) {
                  const payload = {_id: user._id, name: user.name};
                  jwt.sign(
                      payload,
                      keys.secretOrKey,
                      {expiresIn: 31556926},
                      (err, token) => {
                        if (err) next(err);
                        if (token) {
                          res.status(200).json({
                            message: 'Success!',
                            success: true,
                            token: 'Bearer ' + token,
                          });
                        }
                      }
                  );
                } else {
                  const err = {};
                  err.errors = {password: 'incorrect password'};
                  err.status = 400;
                  return next(err);
                }
              })
              .catch((err) => next(err));
        }
      })
      .catch((err) => next(err));
};

exports.getAllUsers = async (req, res, next) => {
  const field1 = 'reviews';
  const field2 = 'reviewsCount';
  const select = '-__v';
  const options = '-__v -password';
  User.find({}, options)
      .populate(field1, select)
      .populate(field2)
      .then((users) => res.status(200).json(users))
      .catch((err) => next(err));
};

exports.getUser = async (req, res, next) => {
  const {_id} = req.params;
  const field1 = 'reviews';
  const field2 = 'reviewsCount';
  const select = '-__v';
  const options = '-__v -password';
  User.findById(_id, options)
      .populate(field1, select)
      .populate(field2)
      .then((user) => {
        if (!user) {
          const err = {};
          err.errors = {_id: `No user found with _id ${_id}`};
          err.status = 400;
          return next(err);
        } else {
          res.status(200).json(user);
        }
      })
      .catch((err) => next(err));
};

exports.updateUser = async (req, res, next) => {
  const update = req.body;
  const {_id} = req.params;

  const {errors, isValid} = validateUpdateUserInput(update);

  if (!isValid) {
    const err = {};
    err.errors = errors;
    err.status = 400;
    return next(err);
  }

  if (update._id) {
    const err = {};
    err.errors = {_id: `Update failed: cannot update field: _id`};
    err.status = 400;
    return next(err);
  } else {
    if (update.password) {
      delete update.password2;
      bcrypt.genSalt(10, (err, salt) => {
        if (err) next(err);
        bcrypt.hash(update.password, salt, (err, hash) => {
          if (err) next(err);
          update.password = hash;
        });
      });
    }

    User.findByIdAndUpdate(_id, update)
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

exports.deleteUser = async (req, res, next) => {
  const {_id} = req.params;
  User.findByIdAndRemove(_id)
      .then((deletedUser) => {
        if (!deletedUser) {
          const err = {};
          err.errors = {_id: `No user found with _id: ${_id}`};
          err.status = 400;
          return next(err);
        } else {
          res.status(200).json({
            message: 'Success!',
            deleted: deletedUser._id,
          });
        }
      })
      .catch((err) => next(err));
};

"use strict";

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

// Load input validation
const validateAddUserInput = require("../validation/add_user");
const validateLoginInput = require("../validation/login");
const validateUpdateUserInput = require("../validation/update_user");

// Load User model
const User = require("../models/User");

exports.add_user = async (req, res, next) => {
  const input = req.body;
  // Form validation
  const { errors, isValid } = validateAddUserInput(input);
  // Check validation
  if (!isValid) {
    const err = new Error(`Bad Request: ${errors}`);
    err.status = 400;
    return next(err);
  }
  const newUser = new User(input);
  //Hash password before saving in database
  bcrypt.genSalt(10, (err, salt) => {
    if (err) next(err);
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) next(err);
      newUser.password = hash;
      newUser.save().then(user => res.status(201).json({
        message: "Success!", 
        userId: user._id 
      })).catch(err => next(err));
    });
  });
};

exports.login_user = async (req, res, next) => {
  const input = req.body;
  const { email, password } = input;
  // Form validation
  const { errors, isValid } = validateLoginInput(input);
  // Check validation
  if (!isValid) {
    const err = new Error(`Bad Request: ${errors}`);
    err.status = 400;
    return next(err);
  }
  User.findOne({ email }).then(user => {
    if (!user) {
      const err = new Error("Email not found");
      err.status = 404;
      return next(err);
    } else {
      // Check password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          // User matched
          // Create JWT Payload
          const payload = { _id: user._id, name: user.name };
          // Sign token
          jwt.sign(payload, keys.secretOrKey, {
            expiresIn: 31556926 // 1 year in seconds
          }, (err, token) => {
            if (err) next(err);
            if (token) return res.status(200).json({ message: "Success!" });
          });
        } else {
          const err = new Error("Password incorrect");
          err.status = 400;
          next(err);
        }
      }).catch(err => next(err));
    }
  }).catch(err => next(err));
};

exports.get_all_users = async (req, res, next) => {
  User.find({}, "-__v -password").populate("reviews", "-__v").then(users => 
    res.status(200).json(users)
  ).catch(err => next(err));
};

exports.get_user = async (req, res, next) => {
  const { _id } = req.params;
  User.findById(_id, "-__v -password").populate("reviews", "-__v").then(user => {
    if (!user) {
      const err = new Error(`Bad Request: No user found with _id ${_id}`);
      err.status = 400;
      next(err);
    } else {
      return res.status(200).json(user);
    }
  }).catch(err => next(err));
};

exports.update_user = async (req, res, next) => {
  const update = req.body;
  const { _id } = req.params;
  
  // Form validation
  const { errors, isValid } = validateUpdateUserInput(update);

  // Check validation
  if (!isValid) {
    const err = new Error(`Bad Request: ${errors}`);
    err.status = 400;
    return next(err);
  }

  if (update._id) {
    const err = new Error(`Update failed: cannot update field: _id`);
    err.status = 400;
    return next(err);
  } else {
    if (update.password) {
      delete update.password2;
      //Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        if (err) next(err);
        bcrypt.hash(update.password, salt, (err, hash) => {
          if (err) next(err);
          update.password = hash;
        });
      });
    }

    User.findByIdAndUpdate(_id, update).then(updated => {
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

exports.delete_user = async (req, res, next) => {
  const { _id } = req.params;
  User.findByIdAndRemove(_id).then(deletedUser => {
    if (!deletedUser) {
      const err = new Error(`No user found with _id: ${_id}`);
      err.status = 400;
      next(err);
    } else {
      return res.status(200).json({
        message: "Success!",
        deleted: deletedUser._id
      });
    }
  }).catch(err => next(err));
};

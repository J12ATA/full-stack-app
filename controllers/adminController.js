"use strict";

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

// Load input validation
const validateAddAdminInput = require("../validation/add_admin");
const validateLoginInput = require("../validation/login");
const validateUpdateAdminInput = require("../validation/update_admin");

// Load Admin model
const Admin = require("../models/Admin");

exports.add_admin = async (req, res, next) => {
  const input = req.body;
  // Form validation
  const { errors, isValid } = validateAddAdminInput(input);
  // Check validation
  if (!isValid) {
    const err = new Error(`Bad Request: ${errors}`);
    err.status = 400;
    return next(err);
  }
  Admin.find({}).then(admins => {
    if (!admins || admins.length > 0) {
      const err = new Error("Bad Request: An admin already exists");
      err.status = 400;
      return next(err);
    } else {
      delete input.password2;
      const newAdmin = new Admin(input);
      //Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        if (err) next(err);
        bcrypt.hash(newAdmin.password, salt, (err, hash) => {
          if (err) next(err);
          newAdmin.password = hash;
          newAdmin.save().then(admin => res.status(201).json({
            message: "Success!", 
            adminId: admin._id 
          })).catch(err => next(err));
        });
      });
    }
  }).catch(err => next(err));
};

exports.login_admin = async (req, res, next) => {
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
  
  Admin.findOne({ email }).then(admin => {
    if (!admin) {
      const err = new Error("Email not found");
      err.status = 404;
      return next(err);
    } else {
      // Check password
      bcrypt.compare(password, admin.password).then(isMatch => {
        if (isMatch) {
          // Admin matched
          // Create JWT Payload
          const payload = { _id: admin._id, name: admin.name };
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

exports.get_all_admins = async (req, res, next) => {
  Admin.find({}, "-__v -password").then(admins => 
    res.status(200).json(admins)
  ).catch(err => next(err));
};

exports.get_admin = async (req, res, next) => {
  const { _id } = req.params;
  Admin.findById(_id, "-__v -password").then(admin => {
    if (!admin) {
      const err = new Error(`Bad Request: No admin found with _id ${_id}`);
      err.status = 400;
      next(err);
    } else {
      return res.status(200).json(admin);
    }
  }).catch(err => next(err));
};

exports.update_admin = async (req, res, next) => {
  const update = req.body;
  const { _id } = req.params;

  // Form validation
  const { errors, isValid } = validateUpdateAdminInput(update);

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
    
    Admin.findByIdAndUpdate(_id, update).then(updated => {
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

exports.delete_admin = async (req, res, next) => {
  const { _id } = req.params;
  Admin.findByIdAndRemove(_id).then(deletedAdmin => {
    if (!deletedAdmin) {
      const err = new Error(`No admin found with _id: ${_id}`);
      err.status = 400;
      next(err);
    } else {
      return res.status(200).json({
        message: "Success!",
        deleted: deletedAdmin._id
      });
    }
  }).catch(err => next(err));
};
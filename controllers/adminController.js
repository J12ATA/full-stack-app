/* eslint-disable no-shadow */
/* eslint-disable no-underscore-dangle */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

// Load input validation
const validateAddAdminInput = require('../validation/add_admin');
const validateLoginInput = require('../validation/login');
const validateUpdateAdminInput = require('../validation/update_admin');

const Admin = require('../models/Admin');

exports.addAdmin = async (req, res, next) => {
  const input = req.body;
  const { errors, isValid } = validateAddAdminInput(input);

  if (!isValid) {
    const err = {};
    err.errors = errors;
    err.status = 400;
    return next(err);
  }

  return Admin.find({})
    .then((admins) => {
      if (!admins || admins.length > 0) {
        const err = {};
        err.errors = { email: 'an admin already exists' };
        err.status = 400;
        return next(err);
      }
      delete input.password2;
      const newAdmin = new Admin(input);
      return bcrypt.genSalt(10, (err, salt) => {
        if (err) next(err);
        bcrypt.hash(newAdmin.password, salt, (err, hash) => {
          if (err) next(err);
          newAdmin.password = hash;
          newAdmin
            .save()
            .then((admin) => res.status(201).json({
              message: 'Success!',
              adminId: admin._id,
            }))
            .catch((err) => next(err));
        });
      });
    })
    .catch((err) => next(err));
};

exports.loginAdmin = async (req, res, next) => {
  const input = req.body;
  const { email, password } = input;
  const { errors, isValid } = validateLoginInput(input);

  if (!isValid) {
    const err = {};
    err.errors = errors;
    err.status = 400;
    return next(err);
  }

  return Admin.findOne({ email })
    .then((admin) => {
      if (!admin) {
        const err = {};
        err.errors = { email: 'email not found' };
        err.status = 404;
        return next(err);
      }
      return bcrypt
        .compare(password, admin.password)
        .then((isMatch) => {
          if (isMatch) {
            const payload = { _id: admin._id, name: admin.name };
            return jwt.sign(
              payload,
              keys.secretOrKey,
              { expiresIn: 31556926 },
              (err, token) => {
                if (err) next(err);
                if (token) {
                  res.status(200).json({
                    message: 'Success!',
                    success: true,
                    token: `Bearer ${token}`,
                  });
                }
              },
            );
          }
          const err = {};
          err.errors = { password: 'incorrect password' };
          err.status = 400;
          return next(err);
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};

exports.getAllAdmins = async (req, res, next) => {
  const options = '-__v -password';
  Admin.find({}, options)
    .then((admins) => res.status(200).json(admins))
    .catch((err) => next(err));
};

exports.getAdmin = async (req, res, next) => {
  const { _id } = req.params;
  const options = '-__v -password';

  return Admin.findById(_id, options)
    .then((admin) => {
      if (!admin) {
        const err = {};
        err.errros = { error: `No admin found with _id ${_id}` };
        err.status = 400;
        return next(err);
      }
      return res.status(200).json(admin);
    })
    .catch((err) => next(err));
};

exports.updateAdmin = async (req, res, next) => {
  const update = req.body;
  const { _id } = req.params;

  const { errors, isValid } = validateUpdateAdminInput(update);

  if (!isValid) {
    const err = {};
    err.errors = errors;
    err.status = 400;
    return next(err);
  }

  if (update._id) {
    const err = {};
    err.errors = { _id: 'Update failed: cannot update field: _id' };
    err.status = 400;
    return next(err);
  }

  if (update.password) {
    delete update.password2;
    return bcrypt.genSalt(10, (err, salt) => {
      if (err) next(err);
      bcrypt.hash(update.password, salt, (err, hash) => {
        if (err) next(err);
        update.password = hash;
      });
    });
  }

  return Admin.findByIdAndUpdate(_id, update)
    .then((updated) => {
      if (!updated) {
        const err = {};
        err.errors = {
          _id: `Update failed, no review found with _id: ${_id}`,
        };
        err.status = 400;
        return next(err);
      }
      return res.status(200).json({ message: 'Success!' });
    })
    .catch((err) => next(err));
};

exports.deleteAdmin = async (req, res, next) => {
  const { _id } = req.params;

  return Admin.findByIdAndRemove(_id)
    .then((deletedAdmin) => {
      if (!deletedAdmin) {
        const err = {};
        err.errors = { _id: `No admin found with _id: ${_id}` };
        err.status = 400;
        return next(err);
      }
      return res.status(200).json({
        message: 'Success!',
        deleted: deletedAdmin._id,
      });
    })
    .catch((err) => next(err));
};

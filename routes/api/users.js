const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

// Load input validation
const validateAddAdminInput = require("../../validation/add_admin");
const validateLoginInput = require("../../validation/login");
const validateAddReviewerInput = require("../../validation/add_reviewer");
const validateAddProductInput = require("../../validation/add_product");

// Load Admin model
const Admin = require("../../models/Admin");

// Load Reviewer model
const Reviewer = require("../../models/Reviewer");

// Load Product model
const Product = require("../../models/Product");

// @route POST api/users/add_product
// @desc AddProduct product
// @acess Public
router.post("/add_product", (req, res) => {
  // Form validation
  const { errors, isValid } = validateAddProductInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  Product.findOne({ name: req.body.name }).then(product => {
    if (product) {
      return res.status(400).json({ name: "Product already exists" });
    }
  });

  const newProduct = new Product({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price
  });

  newProduct
    .save()
    .then(product => res.json(product))
    .catch(err => console.log(err));
});

// @route POST api/users/add_admin
// @desc AddAdmin admin
// @access Public
router.post("/add_admin", (req, res) => {
  // Form validation
  const { errors, isValid } = validateAddAdminInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  Admin.findOne({ email: req.body.email }).then(admin => {
    if (admin) {
      return res.status(400).json({ email: "Email already exists" });
    }
  });

  const newAdmin = new Admin({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });

  // Hash password before saving in database
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newAdmin.password, salt, (err, hash) => {
      if (err) throw err;
      newAdmin.password = hash;
      newAdmin
        .save()
        .then(admin => res.json(admin))
        .catch(err => console.log(err));
    });
  });
});

// @route POST api/users/add_reviewer
// @desc AddReviewer reviewer
// @access Public
router.post("/add_reviewer", (req, res) => {
  // Form validation
  const { errors, isValid } = validateAddReviewerInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  Reviewer.findOne({ email: req.body.email }).then(reviewer => {
    if (reviewer) {
      return res.status(400).json({ email: "Email already exists" });
    }
  });

  const newReviewer = new Reviewer({
    name: req.body.name,
    email: req.body.email,
    verified: req.body.verified,
    password: req.body.password
  });

  // Hash password before saving in database
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newReviewer.password, salt, (err, hash) => {
      if (err) throw err;
      newReviewer.password = hash;
      newReviewer
        .save()
        .then(reviewer => res.json(reviewer))
        .catch(err => console.log(err));
    });
  });
});

// @route POST api/users/login_admin
// @desc LoginAdmin admin and return JWT token
// @access Public
router.post("/login_admin", (req, res) => {
  // Form validation
  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find admin by email
  Admin.findOne({ email }).then(admin => {
    // Check if admin exists
    if (!admin) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }

    // Check password
    bcrypt.compare(password, admin.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: admin.id,
          name: admin.name
        };

        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

// @route POST api/users/login_reviewer
// @desc LoginReviewer reviewer and return JWT token
// @access Public
router.post("/login_reviewer", (req, res) => {
  // Form validation
  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find reviewer by email
  Reviewer.findOne({ email }).then(reviewer => {
    // Check if reviewer exists
    if (!reviewer) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }

    // Check password
    bcrypt.compare(password, reviewer.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: reviewer.id,
          name: reviewer.name
        };

        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

module.exports = router;

'use strict'

const express = require("express");
const router = express.Router();

// Load productController and destructure it's methods
const { add_user, login_user, get_all_users, get_user, update_user, delete_user } = require("../controllers/userController");

// @route POST api/users/add_user
router.post("/add_user", add_user);

// @route POST api/users/login_user
router.post("/login_user", login_user);

// @route GET api/users/get_all_users
router.get("/get_all_users", get_all_users);

// @route GET api/users/:_id
router.get("/:_id", get_user);

// @route PUT api/users/:_id
router.put("/:_id", update_user);

// @route DELETE api/users/:_id
router.delete("/:_id", delete_user);

module.exports = router;
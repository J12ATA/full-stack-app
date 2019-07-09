"use strict"

const express = require("express");
const router = express.Router();

// Load adminController and destructure it's methods
const { add_admin, login_admin, get_all_admins, get_admin, update_admin, delete_admin } = require("../controllers/adminController");

// @route POST api/admin/add_admin
router.post("/add_admin", add_admin);

// @route POST api/admin/login_admin
router.post("/login_admin", login_admin);

// @route GET api/admin/get_all_admins
router.get("/get_all_admins", get_all_admins);

// @route GET api/admin/:_id
router.get("/:_id", get_admin);

// @route PUT api/admin/:_id
router.put("/:_id", update_admin);

// @route DELETE api/admin/:_id
router.delete("/:_id", delete_admin);

module.exports = router;
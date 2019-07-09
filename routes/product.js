"use strict"

const express = require("express");
const router = express.Router();

// Load productController and destructure it's methods
const { add_product, get_all_products, get_product, update_product, delete_product } = require("../controllers/productController");

// @route POST api/products/add_product
router.post("/add_product", add_product);

// @route GET api/products/get_all_products
router.get("/get_all_products", get_all_products);

// @route GET api/products/:_id
router.get("/:_id", get_product);

// @route PUT api/products/:_id
router.put("/:_id", update_product);

// @route DELETE api/products/:_id
router.delete("/:_id", delete_product);

module.exports = router;
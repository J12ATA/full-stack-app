
const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();

// Load productController and destructure it's methods
const {
  addProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

// @route POST api/products/add_product
router.post('/add_product', addProduct);

// @route GET api/products/get_all_products
router.get('/get_all_products', getAllProducts);

// @route GET api/products/:_id
router.get('/:_id', getProduct);

// @route PUT api/products/:_id
router.put('/:_id', updateProduct);

// @route DELETE api/products/:_id
router.delete('/:_id', deleteProduct);

module.exports = router;

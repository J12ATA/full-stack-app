
const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();

// Load productController and destructure it's methods
const {
  addUser,
  loginUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

// @route POST api/users/add_user
router.post('/add_user', addUser);

// @route POST api/users/login_user
router.post('/login_user', loginUser);

// @route GET api/users/get_all_users
router.get('/get_all_users', getAllUsers);

// @route GET api/users/:_id
router.get('/:_id', getUser);

// @route PUT api/users/:_id
router.put('/:_id', updateUser);

// @route DELETE api/users/:_id
router.delete('/:_id', deleteUser);

module.exports = router;

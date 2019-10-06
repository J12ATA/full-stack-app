
const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();

// Load adminController and destructure it's methods
const {
  addAdmin,
  loginAdmin,
  getAllAdmins,
  getAdmin,
  updateAdmin,
  deleteAdmin,
} = require('../controllers/adminController');

// @route POST api/admin/add_admin
router.post('/add_admin', addAdmin);

// @route POST api/admin/login_admin
router.post('/login_admin', loginAdmin);

// @route GET api/admin/get_all_admins
router.get('/get_all_admins', getAllAdmins);

// @route GET api/admin/:_id
router.get('/:_id', getAdmin);

// @route PUT api/admin/:_id
router.put('/:_id', updateAdmin);

// @route DELETE api/admin/:_id
router.delete('/:_id', deleteAdmin);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
    getAllAdmins,
    getAdminById,
    createAdmin,
    updateAdmin,
    loginAdmin,
    deleteAdmin,
    logoutAdmin
} = require('../controllers/adminController');

// Basic CRUD routes
router.get('/', getAllAdmins); // Get all admins
router.get('/:id', getAdminById); // Get single admin
router.post('/', createAdmin); // Create new admin
router.put('/:id', updateAdmin); // Update admin
router.delete('/:id', deleteAdmin); // Delete admin
router.post('/login', loginAdmin); // login admin
router.post('/logout', logoutAdmin); // logout admin

module.exports = router; 
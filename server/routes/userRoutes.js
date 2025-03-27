const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/userController');
const { validateUserRegistration, validateUserUpdate } = require('../utils/validationMiddleware');

// All routes are public for now
router.post('/', validateUserRegistration, createUser);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', validateUserUpdate, updateUser);
router.delete('/:id', deleteUser);

module.exports = router; 
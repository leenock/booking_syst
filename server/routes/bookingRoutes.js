const express = require('express');
const router = express.Router();
const {
    getAllBookings,
    getBookingById,
    createBooking,
    updateBooking,
    deleteBooking,
    getUserBookings
} = require('../controllers/bookingController');
const { validateBookingCreation } = require('../utils/validationMiddleware');

// All routes are public for now
router.post('/', validateBookingCreation, createBooking);
router.get('/user/:userId', getUserBookings);
router.get('/', getAllBookings);
router.get('/:id', getBookingById);
router.put('/:id', validateBookingCreation, updateBooking);
router.delete('/:id', deleteBooking);

module.exports = router; 
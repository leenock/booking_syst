const express = require('express');
const router = express.Router();
const {
    getAllBookings,
    getBookingById,
    createBooking,
    updateBooking,
    deleteBooking,
    getUserBookings,
    getBookingsByVisitorEmail,
    getBookedDates,
} = require('../controllers/bookingController');

// All routes are public for now
router.post('/', createBooking);
router.get('/user/:userId', getUserBookings);
router.get('/visitor/:email', getBookingsByVisitorEmail);
router.get('/', getAllBookings);
router.get('/booked_dates', getBookedDates); // Get booked dates for all rooms
// Get booked dates for a specific room type
router.get('/booked_dates/:roomType', getBookedDates);
router.get('/:id', getBookingById);
router.put('/:id', updateBooking);
router.delete('/:id', deleteBooking);

module.exports = router; 
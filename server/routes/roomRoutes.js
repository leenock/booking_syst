const express = require('express');
const router = express.Router();
const {
    getAllRooms,
    getRoomById,
    createRoom,
    updateRoom,
    deleteRoom
} = require('../controllers/roomController');

// Get all rooms
router.get('/', getAllRooms);

// Get room by ID
router.get('/:id', getRoomById);

// Create new room
router.post('/', createRoom);

// Update room
router.put('/:id', updateRoom);

// Delete room
router.delete('/:id', deleteRoom);

module.exports = router; 
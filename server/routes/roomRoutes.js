const express = require('express');
const router = express.Router();
const {
    getAllRooms,
    getRoomById,
    createRoom,
    updateRoom,
    deleteRoom,
    getAvailableRooms
} = require('../controllers/roomController');
const { validateRoomCreation } = require('../utils/validationMiddleware');

// All routes are public - no authentication required
router.get('/', getAllRooms);
router.get('/available', getAvailableRooms);
router.get('/:id', getRoomById);
router.post('/', validateRoomCreation, createRoom);
router.put('/:id', validateRoomCreation, updateRoom);
router.delete('/:id', deleteRoom);

module.exports = router; 
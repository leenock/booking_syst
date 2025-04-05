const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all rooms
const getAllRooms = async (req, res) => {
    try {
        const rooms = await prisma.room.findMany({
            orderBy: {
                roomNumber: 'asc'
            }
        });

        res.status(200).json({
            success: true,
            count: rooms.length,
            data: rooms
        });
    } catch (error) {
        console.error('Error fetching rooms:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch rooms',
            message: error.message 
        });
    }
};

// Get available rooms
const getAvailableRooms = async (req, res) => {
    try {
        const rooms = await prisma.room.findMany({
            where: {
                status: 'AVAILABLE'
            },
            orderBy: {
                roomNumber: 'asc'
            }
        });

        res.status(200).json(rooms);
    } catch (error) {
        console.error('Error fetching available rooms:', error);
        res.status(500).json({ error: 'Failed to fetch available rooms' });
    }
};

// Get room by ID
const getRoomById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const room = await prisma.room.findUnique({
            where: { id }
        });

        if (!room) {
            return res.status(404).json({ 
                success: false,
                error: 'Room not found' 
            });
        }

        res.status(200).json({
            success: true,
            data: room
        });
    } catch (error) {
        console.error('Error fetching room:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch room',
            message: error.message 
        });
    }
};

// Create new room
const createRoom = async (req, res) => {
    try {
        const {
            roomNumber,
            type,
            price,
            capacity,
            description,
            amenities
        } = req.body;

        // Basic validation
        if (!roomNumber || !type || !price || !capacity) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields',
                details: {
                    roomNumber: !roomNumber ? 'Room number is required' : null,
                    type: !type ? 'Room type is required' : null,
                    price: !price ? 'Price is required' : null,
                    capacity: !capacity ? 'Capacity is required' : null
                }
            });
        }

        // Check if room number already exists
        const existingRoom = await prisma.room.findUnique({
            where: { roomNumber }
        });

        if (existingRoom) {
            return res.status(400).json({
                success: false,
                error: 'Room number already exists'
            });
        }

        const room = await prisma.room.create({
            data: {
                roomNumber,
                type: type.toUpperCase(),
                price: parseFloat(price),
                capacity: parseInt(capacity),
                description: description || null,
                amenities: amenities || []
            }
        });

        res.status(201).json({
            success: true,
            message: 'Room created successfully',
            data: room
        });
    } catch (error) {
        console.error('Error creating room:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create room',
            message: error.message
        });
    }
};

// Update room
const updateRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            roomNumber,
            type,
            price,
            capacity,
            description,
            amenities,
            status
        } = req.body;

        // Check if room exists
        const existingRoom = await prisma.room.findUnique({
            where: { id }
        });

        if (!existingRoom) {
            return res.status(404).json({
                success: false,
                error: 'Room not found'
            });
        }

        // If room number is being changed, check if new number exists
        if (roomNumber && roomNumber !== existingRoom.roomNumber) {
            const roomWithNumber = await prisma.room.findUnique({
                where: { roomNumber }
            });

            if (roomWithNumber) {
                return res.status(400).json({
                    success: false,
                    error: 'Room number already exists'
                });
            }
        }

        // Validate status
        if (status && !['AVAILABLE', 'MAINTENANCE'].includes(status)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid status. Status must be either AVAILABLE or MAINTENANCE'
            });
        }

        const updatedRoom = await prisma.room.update({
            where: { id },
            data: {
                roomNumber: roomNumber || undefined,
                type: type ? type.toUpperCase() : undefined,
                price: price ? parseFloat(price) : undefined,
                capacity: capacity ? parseInt(capacity) : undefined,
                description: description || undefined,
                amenities: amenities || undefined,
                status: status || undefined
            }
        });

        res.status(200).json({
            success: true,
            message: 'Room updated successfully',
            data: updatedRoom
        });
    } catch (error) {
        console.error('Error updating room:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update room',
            message: error.message
        });
    }
};

// Delete room
const deleteRoom = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if room exists
        const existingRoom = await prisma.room.findUnique({
            where: { id }
        });

        if (!existingRoom) {
            return res.status(404).json({
                success: false,
                error: 'Room not found'
            });
        }

        // Check if room has any bookings
        const bookings = await prisma.booking.findMany({
            where: { roomId: id }
        });

        if (bookings.length > 0) {
            return res.status(400).json({
                success: false,
                error: 'Cannot delete room with existing bookings'
            });
        }

        await prisma.room.delete({
            where: { id }
        });

        res.status(200).json({
            success: true,
            message: 'Room deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting room:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete room',
            message: error.message
        });
    }
};

module.exports = {
    getAllRooms,
    getAvailableRooms,
    getRoomById,
    createRoom,
    updateRoom,
    deleteRoom
}; 
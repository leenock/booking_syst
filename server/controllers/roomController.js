const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all rooms
const getAllRooms = async (req, res) => {
    try {
        const rooms = await prisma.room.findMany({
            include: {
                bookings: {
                    select: {
                        checkIn: true,
                        checkOut: true,
                        isActive: true
                    }
                }
            }
        });
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch rooms' });
    }
};

// Get room by ID
const getRoomById = async (req, res) => {
    try {
        const { id } = req.params;
        const room = await prisma.room.findUnique({
            where: { id },
            include: {
                bookings: {
                    select: {
                        checkIn: true,
                        checkOut: true,
                        isActive: true
                    }
                }
            }
        });

        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        res.status(200).json(room);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch room' });
    }
};

// Create new room
const createRoom = async (req, res) => {
    try {
        const { roomNumber, type, price, isAvailable } = req.body;

        // Validate required fields
        if (!roomNumber || !type || !price) {
            return res.status(400).json({ error: 'Room number, type, and price are required' });
        }

        // Check if room number already exists
        const existingRoom = await prisma.room.findUnique({
            where: { roomNumber }
        });

        if (existingRoom) {
            return res.status(400).json({ error: 'Room with this number already exists' });
        }

        // Create room
        const room = await prisma.room.create({
            data: {
                roomNumber,
                type,
                price,
                isAvailable
            }
        });

        res.status(201).json(room);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create room' });
    }
};

// Update room
const updateRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const { roomNumber, type, price, isAvailable } = req.body;

        // Check if room exists
        const existingRoom = await prisma.room.findUnique({
            where: { id }
        });

        if (!existingRoom) {
            return res.status(404).json({ error: 'Room not found' });
        }

        // Check if new room number is already taken by another room
        if (roomNumber && roomNumber !== existingRoom.roomNumber) {
            const roomWithNumber = await prisma.room.findUnique({
                where: { roomNumber }
            });

            if (roomWithNumber) {
                return res.status(400).json({ error: 'Room number already in use' });
            }
        }

        // Update room
        const updatedRoom = await prisma.room.update({
            where: { id },
            data: {
                roomNumber,
                type,
                price,
                isAvailable
            }
        });

        res.status(200).json(updatedRoom);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update room' });
    }
};

// Delete room
const deleteRoom = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if room exists
        const existingRoom = await prisma.room.findUnique({
            where: { id },
            include: {
                bookings: true
            }
        });

        if (!existingRoom) {
            return res.status(404).json({ error: 'Room not found' });
        }

        // Check if room has any bookings
        if (existingRoom.bookings.length > 0) {
            return res.status(400).json({ error: 'Cannot delete room with existing bookings' });
        }

        // Delete room
        await prisma.room.delete({
            where: { id }
        });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete room' });
    }
};

// Get available rooms
const getAvailableRooms = async (req, res) => {
    try {
        const { checkIn, checkOut } = req.query;

        if (!checkIn || !checkOut) {
            return res.status(400).json({ error: 'Check-in and check-out dates are required' });
        }

        const availableRooms = await prisma.room.findMany({
            where: {
                isAvailable: true,
                bookings: {
                    none: {
                        OR: [
                            {
                                AND: [
                                    { checkIn: { lte: new Date(checkOut) } },
                                    { checkOut: { gte: new Date(checkIn) } }
                                ]
                            }
                        ]
                    }
                }
            }
        });

        res.status(200).json(availableRooms);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch available rooms' });
    }
};

module.exports = {
    getAllRooms,
    getRoomById,
    createRoom,
    updateRoom,
    deleteRoom,
    getAvailableRooms
}; 
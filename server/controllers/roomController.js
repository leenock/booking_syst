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

        res.status(200).json(rooms);
    } catch (error) {
        console.error('Error fetching rooms:', error);
        res.status(500).json({ error: 'Failed to fetch rooms' });
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
            return res.status(404).json({ error: 'Room not found' });
        }

        res.status(200).json(room);
    } catch (error) {
        console.error('Error fetching room:', error);
        res.status(500).json({ error: 'Failed to fetch room' });
    }
};

// Create new room
const createRoom = async (req, res) => {
    try {
        const { roomNumber, type, price, capacity, status, description, amenities } = req.body;

        // Check if room number already exists
        const existingRoom = await prisma.room.findUnique({
            where: { roomNumber }
        });

        if (existingRoom) {
            return res.status(400).json({ error: 'Room with this number already exists' });
        }

        const room = await prisma.room.create({
            data: {
                roomNumber,
                type,
                price,
                capacity,
                status,
                description,
                amenities
            }
        });

        res.status(201).json(room);
    } catch (error) {
        console.error('Error creating room:', error);
        res.status(500).json({ error: 'Failed to create room' });
    }
};

// Update room
const updateRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const { roomNumber, type, price, capacity, status, description, amenities } = req.body;

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
                return res.status(400).json({ error: 'Room with this number already exists' });
            }
        }

        const updatedRoom = await prisma.room.update({
            where: { id },
            data: {
                roomNumber,
                type,
                price,
                capacity,
                status,
                description,
                amenities
            }
        });

        res.status(200).json(updatedRoom);
    } catch (error) {
        console.error('Error updating room:', error);
        res.status(500).json({ error: 'Failed to update room' });
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
            return res.status(404).json({ error: 'Room not found' });
        }

        await prisma.room.delete({
            where: { id }
        });

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting room:', error);
        res.status(500).json({ error: 'Failed to delete room' });
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
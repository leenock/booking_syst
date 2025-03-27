const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all bookings
const getAllBookings = async (req, res) => {
    try {
        const bookings = await prisma.booking.findMany({
            include: {
                room: true,
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            }
        });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
};

// Get booking by ID
const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await prisma.booking.findUnique({
            where: { id },
            include: {
                room: true,
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            }
        });

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch booking' });
    }
};

// Create new booking
const createBooking = async (req, res) => {
    try {
        const {
            fullName,
            email,
            phone,
            adults,
            kids,
            specialRequest,
            paymentMethod,
            roomType,
            roomPrice,
            userId,
            roomId,
            checkIn,
            checkOut
        } = req.body;

        // Validate required fields
        if (!fullName || !email || !roomId || !checkIn || !checkOut) {
            return res.status(400).json({ error: 'Required fields are missing' });
        }

        // Check if room exists and is available
        const room = await prisma.room.findUnique({
            where: { id: roomId },
            include: {
                bookings: {
                    where: {
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

        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        if (!room.isAvailable) {
            return res.status(400).json({ error: 'Room is not available' });
        }

        if (room.bookings.length > 0) {
            return res.status(400).json({ error: 'Room is already booked for these dates' });
        }

        // Create booking
        const booking = await prisma.booking.create({
            data: {
                fullName,
                email,
                phone,
                adults,
                kids,
                specialRequest,
                paymentMethod,
                roomType,
                roomPrice,
                userId: userId ? parseInt(userId) : null,
                roomId,
                checkIn: new Date(checkIn),
                checkOut: new Date(checkOut)
            },
            include: {
                room: true,
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            }
        });

        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create booking' });
    }
};

// Update booking
const updateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            fullName,
            email,
            phone,
            adults,
            kids,
            specialRequest,
            paymentMethod,
            roomType,
            roomPrice,
            checkIn,
            checkOut
        } = req.body;

        // Check if booking exists
        const existingBooking = await prisma.booking.findUnique({
            where: { id }
        });

        if (!existingBooking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // If dates are being changed, check room availability
        if (checkIn || checkOut) {
            const room = await prisma.room.findUnique({
                where: { id: existingBooking.roomId },
                include: {
                    bookings: {
                        where: {
                            id: { not: id },
                            OR: [
                                {
                                    AND: [
                                        { checkIn: { lte: new Date(checkOut || existingBooking.checkOut) } },
                                        { checkOut: { gte: new Date(checkIn || existingBooking.checkIn) } }
                                    ]
                                }
                            ]
                        }
                    }
                }
            });

            if (room.bookings.length > 0) {
                return res.status(400).json({ error: 'Room is already booked for these dates' });
            }
        }

        // Update booking
        const updatedBooking = await prisma.booking.update({
            where: { id },
            data: {
                fullName,
                email,
                phone,
                adults,
                kids,
                specialRequest,
                paymentMethod,
                roomType,
                roomPrice,
                checkIn: checkIn ? new Date(checkIn) : undefined,
                checkOut: checkOut ? new Date(checkOut) : undefined
            },
            include: {
                room: true,
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            }
        });

        res.status(200).json(updatedBooking);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update booking' });
    }
};

// Delete booking
const deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if booking exists
        const existingBooking = await prisma.booking.findUnique({
            where: { id }
        });

        if (!existingBooking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Delete booking
        await prisma.booking.delete({
            where: { id }
        });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete booking' });
    }
};

// Get user's bookings
const getUserBookings = async (req, res) => {
    try {
        const { userId } = req.params;
        const bookings = await prisma.booking.findMany({
            where: { userId: parseInt(userId) },
            include: {
                room: true
            }
        });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user bookings' });
    }
};

module.exports = {
    getAllBookings,
    getBookingById,
    createBooking,
    updateBooking,
    deleteBooking,
    getUserBookings
}; 
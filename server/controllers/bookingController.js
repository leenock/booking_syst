const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get all bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        room: {
          select: {
            id: true,
            roomNumber: true,
            type: true,
            price: true,
            status: true,
            amenities: true,
            description: true,
            capacity: true,
            createdAt: true,
          },
        },
        visitorAccount: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            isActive: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format the response data
    const formattedBookings = bookings.map((booking) => ({
      id: booking.id,
      fullName: booking.fullName,
      email: booking.email,
      phone: booking.phone,
      adults: booking.adults,
      kids: booking.kids,
      specialRequest: booking.specialRequest,
      roomType: booking.roomType,
      roomPrice: booking.roomPrice,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      paymentMethod: booking.paymentMethod,
      status: booking.status,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
      room: booking.room,
      visitorAccount: booking.visitorAccount,
    }));

    res.status(200).json({
      success: true,
      count: formattedBookings.length,
      data: formattedBookings,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch bookings",
      message: error.message,
    });
  }
};

// Get booking by ID
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        room: {
          select: {
            id: true,
            roomNumber: true,
            type: true,
            price: true,
            status: true,
            amenities: true,
            description: true,
            capacity: true,
            createdAt: true,
          },
        },
        visitorAccount: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            isActive: true,
          },
        },
      },
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: "Booking not found",
      });
    }

    // Format the response data
    const formattedBooking = {
      id: booking.id,
      fullName: booking.fullName,
      email: booking.email,
      phone: booking.phone,
      adults: booking.adults,
      kids: booking.kids,
      specialRequest: booking.specialRequest,
      roomType: booking.roomType,
      roomPrice: booking.roomPrice,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      paymentMethod: booking.paymentMethod,
      status: booking.status,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
      room: booking.room,
      visitorAccount: booking.visitorAccount,
    };

    res.status(200).json({
      success: true,
      data: formattedBooking,
    });
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch booking",
      message: error.message,
    });
  }
};

// Create booking

const createBooking = async (req, res) => {
  try {
    console.log("Received booking request:", req.body);

    // Destructure required fields from request body
    const {
      fullName,
      email,
      phone,
      adults,
      kids,
      specialRequest,
      roomType,
      roomPrice,
      roomId,
      checkIn,
      checkOut,
      paymentMethod = "MPESA", // Default to CASH if not provided
    } = req.body;

    // Basic validation for required fields
    if (
      !fullName ||
      !email ||
      !roomType ||
      !roomPrice ||
      !roomId ||
      !checkIn ||
      !checkOut
    ) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
        details: {
          fullName: !fullName ? "Full name is required" : null,
          email: !email ? "Email is required" : null,
          roomType: !roomType ? "Room type is required" : null,
          roomPrice: !roomPrice ? "Room price is required" : null,
          roomId: !roomId ? "Room ID is required" : null,
          checkIn: !checkIn ? "Check-in date is required" : null,
          checkOut: !checkOut ? "Check-out date is required" : null,
        },
      });
    }

    // Log the email we're searching for
    console.log(
      "Searching for visitor account with email:",
      email.toLowerCase()
    );

    // Check if there's a visitor account with this email
    const visitorAccount = await prisma.visitorAccount.findFirst({
      where: {
        email: email.toLowerCase(), // Convert to lowercase for case-insensitive comparison
      },
    });

    console.log("Found visitor account:", visitorAccount); // Debug log

    // If no visitor account found, let's check all visitor accounts to see what's in the database
    if (!visitorAccount) {
      const allVisitorAccounts = await prisma.visitorAccount.findMany();
      console.log("All visitor accounts in database:", allVisitorAccounts);
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
                  { checkOut: { gte: new Date(checkIn) } },
                ],
              },
            ],
          },
        },
      },
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        error: "Room not found",
      });
    }

    // Check room status
    if (room.status === "MAINTENANCE") {
      return res.status(400).json({
        success: false,
        error: "Room is under maintenance and cannot be booked",
      });
    }

    if (room.status !== "AVAILABLE") {
      return res.status(400).json({
        success: false,
        error: "Room is not available for booking",
      });
    }

    // Check for existing bookings
    if (room.bookings.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Room is already booked for these dates",
      });
    }

    // Check if the number of adults exceeds the allowed limit (2 adults per room)
    if (adults > 2) {
      return res.status(400).json({
        success: false,
        error: "Maximum number of adults allowed is two",
      });
    }       

    // Create booking data matching schema exactly
    const bookingData = {
      fullName,
      email: email.toLowerCase(), // Store email in lowercase
      phone: phone || null,
      adults: parseInt(adults) || 1,
      kids: parseInt(kids) || 0,
      specialRequest: specialRequest || null,
      roomType: roomType.toUpperCase(),
      roomPrice: parseFloat(roomPrice),
      roomId,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      paymentMethod: paymentMethod.toUpperCase(),
      status: "PENDING",
      visitorAccountId: visitorAccount ? visitorAccount.id : null, // Explicitly set visitorAccountId
    };

    console.log("Creating booking with data:", bookingData);

    // Create the booking
    const booking = await prisma.booking.create({
      data: bookingData,
      include: {
        room: true,
        visitorAccount: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create booking",
      message: error.message,
    });
  }
};

// update booking controller
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
      roomType,
      roomPrice,
      checkIn,
      checkOut,
      status,
      paymentMethod,
    } = req.body;

    // console.log("Update booking request:", { id, ...req.body });

    // Check if booking exists
    const existingBooking = await prisma.booking.findUnique({
      where: { id },
      include: {
        room: true,
        visitorAccount: true,
      },
    });

    if (!existingBooking) {
      //  console.log("Booking not found with ID:", id);
      return res.status(404).json({
        success: false,
        error: "Booking not found",
      });
    }

    // console.log("Existing booking found:", existingBooking);

    // Check for booked dates so that there is no overlap
    const existingBookings = await prisma.booking.findMany({
      where: {
        AND: [
          {
            // Ensure the current booking is excluded
            NOT: {
              id: id, // Exclude the booking being updated by its ID
            },
          },
          {
            // Check for overlapping dates
            OR: [
              {
                AND: [
                  { checkIn: { lte: new Date(checkOut) } }, // Check if check-in date is before or on the updated check-out date
                  { checkOut: { gte: new Date(checkIn) } }, // Check if check-out date is after or on the updated check-in date
                ],
              },
            ],
          },
        ],
      },
    });

    if (existingBookings.length > 0) {
      console.log("Existing bookings found, please try again"); // comment before production
      return res.status(400).json({
        success: false,
        error:
          "Booking dates overlap with existing bookings, kindly re-check the dates again",
      });
    }

    // Prepare update data
    const updateData = {
      // Always include the roomId and paymentMethod from the existing booking
      roomId: existingBooking.roomId,
      paymentMethod: existingBooking.paymentMethod,
    };

    if (fullName) updateData.fullName = fullName;
    if (email) updateData.email = email.toLowerCase();
    if (phone) updateData.phone = phone;
    if (adults) updateData.adults = parseInt(adults);
    if (kids) updateData.kids = parseInt(kids);
    if (specialRequest !== undefined)
      updateData.specialRequest = specialRequest;
    if (roomType) updateData.roomType = roomType.toUpperCase();
    if (roomPrice) updateData.roomPrice = parseFloat(roomPrice);
    if (checkIn) updateData.checkIn = new Date(checkIn);
    if (checkOut) updateData.checkOut = new Date(checkOut);
    if (status) updateData.status = status.toUpperCase();
    if (paymentMethod) updateData.paymentMethod = paymentMethod.toUpperCase();

    //console.log("Update data:", updateData);

    // Update booking

    //console.log("Attempting to update booking with ID:", id);
    // console.log("Update data being sent to Prisma:", updateData);

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: updateData,
      include: {
        room: {
          select: {
            id: true,
            roomNumber: true,
            type: true,
            price: true,
            status: true,
            amenities: true,
            description: true,
            capacity: true,
            createdAt: true,
          },
        },
        visitorAccount: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            isActive: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Booking updated successfully",
      data: updatedBooking,
    });
  } catch (error) {
    console.error("Error processing booking update:", error);
    res.status(500).json({
      success: false,
      error: "Failed to process booking update",
      message: error.message,
    });
  }
};

// Delete booking
const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if booking exists
    const existingBooking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!existingBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Delete booking
    await prisma.booking.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete booking" });
  }
};

// Get user's bookings
const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await prisma.booking.findMany({
      where: { userId: parseInt(userId) },
      include: {
        room: true,
      },
    });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user bookings" });
  }
};

// Get bookings by visitor email
const getBookingsByVisitorEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const bookings = await prisma.booking.findMany({
      where: {
        email: email.toLowerCase(), // Convert to lowercase for case-insensitive comparison
      },
      include: {
        room: {
          select: {
            id: true,
            roomNumber: true,
            type: true,
            price: true,
            status: true,
            amenities: true,
            description: true,
            capacity: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format the response data
    const formattedBookings = bookings.map((booking) => ({
      id: booking.id,
      fullName: booking.fullName,
      email: booking.email,
      phone: booking.phone,
      adults: booking.adults,
      kids: booking.kids,
      specialRequest: booking.specialRequest,
      roomType: booking.roomType,
      roomPrice: booking.roomPrice,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      paymentMethod: booking.paymentMethod,
      status: booking.status,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
      room: booking.room,
    }));

    res.status(200).json({
      success: true,
      count: formattedBookings.length,
      data: formattedBookings,
    });
  } catch (error) {
    console.error("Error fetching visitor bookings:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch visitor bookings",
      message: error.message,
    });
  }
};

module.exports = {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
  getUserBookings,
  getBookingsByVisitorEmail,
};

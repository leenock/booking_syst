const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const transporter = require("../utils/transporter");

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
////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
            status: {
              in: ["PENDING", "CONFIRMED"], // Only active bookings
            },
            AND: [
              {
                checkIn: {
                  lt: new Date(checkOut), // Booking starts before new checkout
                },
              },
              {
                checkOut: {
                  gt: new Date(checkIn), // Booking ends after new checkin
                },
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
      console.log(
        "Filtered bookings (PENDING/CONFIRMED + overlap):",
        room.bookings
      );

      return res.status(400).json({
        success: false,
        error: "Room is already booked for these dates",
      });
    }
    const allBookings = await prisma.booking.findMany({
      where: {
        roomId,
      },
    });

    console.log("All bookings for this room:", allBookings);

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

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Calculate the number of nights (1 night minimum)
    const timeDiff = checkOutDate - checkInDate;
    const nights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    const totalAmount = nights * parseFloat(roomPrice);

    // send email notification
    const mailOptions = {
      from: `"Hotel Management" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Booking Confirmation - Thank You for Choosing Us!",
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 30px; background-color: #fafafa;">
      <h2 style="color: #2c3e50; text-align: center;">Booking Confirmation</h2>
      
      <p style="font-size: 16px;">Dear <strong>${fullName}</strong>,</p>

      <p style="font-size: 15px;">
        We are pleased to confirm your booking. Below are your reservation details:
      </p>

      <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin: 20px 0;">
        <tr style="background-color: #f0f0f0;">
          <td style="padding: 10px;">Room Type:</td>
          <td style="padding: 10px;">${roomType}</td>
        </tr>
        <tr>
          <td style="padding: 10px;">Check-in Date:</td>
          <td style="padding: 10px;">${new Date(checkIn).toLocaleDateString()}</td>
        </tr>
        <tr style="background-color: #f0f0f0;">
          <td style="padding: 10px;">Check-out Date:</td>
          <td style="padding: 10px;">${new Date(checkOut).toLocaleDateString()}</td>
        </tr>
        <tr>
          <td style="padding: 10px;">Number of Adults:</td>
          <td style="padding: 10px;">${adults}</td>
        </tr>
        <tr style="background-color: #f0f0f0;">
          <td style="padding: 10px;">Number of Kids:</td>
          <td style="padding: 10px;">${kids}</td>
        </tr>
        <tr>
          <td style="padding: 10px;">Special Request:</td>
          <td style="padding: 10px;">${specialRequest || "None"}</td>
        </tr>
        <tr style="background-color: #f0f0f0;">
          <td style="padding: 10px;">Room Price:</td>
          <td style="padding: 10px;">KES ${parseFloat(roomPrice).toLocaleString()}</td>
        </tr>
        <tr>
        <td style="padding: 10px;">Total Nights:</td>
        <td style="padding: 10px;">${nights}</td>
      </tr>
      <tr style="background-color: #f0f0f0;">
        <td style="padding: 10px;"><strong>Total Amount</strong>:</td>
        <td style="padding: 10px;"><strong>KES ${totalAmount.toLocaleString()}</strong></td>
      </tr>

        <tr>
          <td style="padding: 10px;">Payment Method:</td>
          <td style="padding: 10px;">${paymentMethod}</td>
        </tr>
        <tr style="background-color: #f0f0f0;">
          <td style="padding: 10px;">Booking Status:</td>
          <td style="padding: 10px;">${bookingData.status}</td>
        </tr>
        <tr>
          <td style="padding: 10px;">Email:</td>
          <td style="padding: 10px;">${email}</td>
        </tr>
        <tr style="background-color: #f0f0f0;">
          <td style="padding: 10px;">Phone:</td>
          <td style="padding: 10px;">${phone}</td>
        </tr>
      </table>

      <p style="font-size: 15px;">
        If you have any questions or would like to make changes to your reservation, please contact us at <a href="mailto:${process.env.EMAIL_USER}">${process.env.EMAIL_USER}</a>.
      </p>

      <p style="margin-top: 30px;">Thank you for choosing us!</p>

      <p style="font-size: 13px; color: #777; text-align: center; border-top: 1px solid #ddd; padding-top: 15px;">
        Vicarage Resorts<br />
        www.vicarageresorts.com<br />
        ☎ 0743666333 | 0746888333
      </p>
    </div>
  `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
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
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
            NOT: { id: id }, // exclude current booking
          },
          {
            roomType: roomType,
          },
          {
            status: {
              not: "CHECKED_OUT", // ✅ ignore checked out bookings
            },
          },
          {
            OR: [
              {
                AND: [
                  { checkIn: { lt: new Date(checkOut) } },
                  { checkOut: { gt: new Date(checkIn) } },
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

    // Check if the number of adults exceeds the allowed limit (2 adults per room)
    if (adults > 2) {
      console.log("Adults exceeds the allowed limit, please try again"); // comment before production
      return res.status(400).json({
        success: false,
        error: "Maximum number of adults per room is 2",
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

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Calculate the number of nights (1 night minimum)
    const timeDiff = checkOutDate - checkInDate;
    const nights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    const totalAmount = nights * parseFloat(roomPrice);

    // Send email notification
    const mailOptions = {
      from: `"Hotel Management" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Booking Update - Thank You for Choosing Us!",
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 30px; background-color: #fafafa;">
      <h2 style="color: #2c3e50; text-align: center;">Booking Update</h2>
      
      <p style="font-size: 16px;">Dear <strong>${fullName}</strong>,</p>

      <p style="font-size: 15px;">
        We have successfully updated your booking. Below are your updated reservation details:
      </p>

      <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin: 20px 0;">
        <tr style="background-color: #f0f0f0;">
          <td style="padding: 10px;">Room Type:</td>
          <td style="padding: 10px;">${roomType}</td>
        </tr>
        <tr>
          <td style="padding: 10px;">Check-in Date:</td>
          <td style="padding: 10px;">${new Date(checkIn).toLocaleDateString()}</td>
        </tr>
        <tr style="background-color: #f0f0f0;">
          <td style="padding: 10px;">Check-out Date:</td>
          <td style="padding: 10px;">${new Date(checkOut).toLocaleDateString()}</td>
        </tr>
        <tr>
          <td style="padding: 10px;">Number of Adults:</td>
          <td style="padding: 10px;">${adults}</td>
        </tr>
        <tr style="background-color: #f0f0f0;">
          <td style="padding: 10px;">Number of Kids:</td>
          <td style="padding: 10px;">${kids}</td>
        </tr>
        <tr>
          <td style="padding: 10px;">Special Request:</td>
          <td style="padding: 10px;">${specialRequest || "None"}</td>
        </tr>
        <tr style="background-color: #f0f0f0;">
          <td style="padding: 10px;">Room Price:</td>
          <td style="padding: 10px;">KES ${parseFloat(roomPrice).toLocaleString()}</td>
        </tr>
         <tr>
        <td style="padding: 10px;">Total Nights:</td>
        <td style="padding: 10px;">${nights}</td>
      </tr>
      <tr style="background-color: #f0f0f0;">
        <td style="padding: 10px;"><strong>Total Amount</strong>:</td>
        <td style="padding: 10px;"><strong>KES ${totalAmount.toLocaleString()}</strong></td>
      </tr>
        <tr>
        <td style="padding: 10px;">Payment Method:</td>
        <td style="padding: 10px;">${paymentMethod}</td>
      </tr>
        <tr style="background-color: #f0f0f0;"> 
          <td style="padding: 10px;">Booking Status:</td>
          <td style="padding: 10px; color:green"><strong>${status}<strong></td>
        </tr>
        <tr>
          <td style="padding: 10px;">Email:</td>
          <td style="padding: 10px;">${email}</td>
        </tr>
        <tr style="background-color: #f0f0f0;">
          <td style="padding: 10px;">Phone:</td>
          <td style="padding: 10px;">${phone}</td>
        </tr>
      </table>
      <p style="font-size: 15px;">
        If you have any questions or would like to make further changes to your reservation, please contact us at <a href="mailto:${process.env.EMAIL_USER}">${process.env.EMAIL_USER}</a>.
      </p>
      <p style="margin-top: 30px;">Thank you for choosing us!</p>
      <p style="font-size: 13px; color: #777; text-align: center; border-top: 1px solid #ddd; padding-top: 15px;">
        Vicarage Resorts<br />
        www.vicarageresorts.com<br />
        ☎ 0743666333 | 0746888333
      </p>
    </div>
  `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
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

// Get booked dates and Get all booked dates for a specific room type
const getBookedDates = async (req, res) => {
  const { roomType } = req.params; // Get roomType from the URL parameter
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        status: {
          in: ["PENDING", "CONFIRMED"], // Only active bookings
        },
        roomType: roomType, // Filter by roomType
      },
      select: {
        checkIn: true,
        checkOut: true,
      },
    });

    const bookedDates = new Set();

    bookings.forEach(({ checkIn, checkOut }) => {
      const current = new Date(checkIn);
      const end = new Date(checkOut);

      while (current < end) {
        bookedDates.add(current.toISOString().split("T")[0]);
        current.setDate(current.getDate() + 1);
      }
    });

    return res.status(200).json({
      success: true,
      bookedDates: Array.from(bookedDates),
    });
  } catch (error) {
    console.error("Error fetching booked dates:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch booked dates",
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
  getBookedDates,
};

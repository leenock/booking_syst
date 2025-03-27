const {
    isValidEmail,
    isValidPhone,
    isValidPassword,
    isValidDate,
    isFutureDate,
    isValidDateRange,
    isEmailUnique,
    isPhoneUnique,
    isValidRoomNumber,
    isValidPrice,
    isValidGuestCount,
    isValidPaymentMethod
} = require('./validators');

// User validation middleware
const validateUserRegistration = async (req, res, next) => {
    const { firstName, lastName, email, password, phone } = req.body;
    const errors = [];

    if (!firstName?.trim()) errors.push('First name is required');
    if (!lastName?.trim()) errors.push('Last name is required');
    if (!email?.trim()) errors.push('Email is required');
    if (!password?.trim()) errors.push('Password is required');
    if (!phone?.trim()) errors.push('Phone number is required');

    if (email && !isValidEmail(email)) errors.push('Invalid email format');
    if (password && !isValidPassword(password)) {
        errors.push('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number');
    }
    if (phone && !isValidPhone(phone)) errors.push('Invalid phone number format');

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    // Check uniqueness
    if (email) {
        const emailUnique = await isEmailUnique(email);
        if (!emailUnique) errors.push('Email is already registered');
    }

    if (phone) {
        const phoneUnique = await isPhoneUnique(phone);
        if (!phoneUnique) errors.push('Phone number is already registered');
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
};

const validateUserUpdate = async (req, res, next) => {
    const { id } = req.params;
    const { email, phone } = req.body;
    const errors = [];

    if (email && !isValidEmail(email)) errors.push('Invalid email format');
    if (phone && !isValidPhone(phone)) errors.push('Invalid phone number format');

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    // Check uniqueness
    if (email) {
        const emailUnique = await isEmailUnique(email, parseInt(id));
        if (!emailUnique) errors.push('Email is already registered');
    }

    if (phone) {
        const phoneUnique = await isPhoneUnique(phone, parseInt(id));
        if (!phoneUnique) errors.push('Phone number is already registered');
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
};

// Room validation middleware
const validateRoomCreation = async (req, res, next) => {
    const { roomNumber, type, price, isAvailable } = req.body;
    const errors = [];

    if (!roomNumber?.trim()) errors.push('Room number is required');
    if (!type?.trim()) errors.push('Room type is required');
    if (price === undefined) errors.push('Price is required');

    if (roomNumber && !isValidRoomNumber(roomNumber)) errors.push('Invalid room number');
    if (price !== undefined && !isValidPrice(price)) errors.push('Invalid price');

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
};

// Booking validation middleware
const validateBookingCreation = async (req, res, next) => {
    const {
        fullName,
        email,
        phone,
        adults,
        kids,
        paymentMethod,
        roomId,
        checkIn,
        checkOut
    } = req.body;
    const errors = [];

    if (!fullName?.trim()) errors.push('Full name is required');
    if (!email?.trim()) errors.push('Email is required');
    if (!phone?.trim()) errors.push('Phone number is required');
    if (adults === undefined) errors.push('Number of adults is required');
    if (kids === undefined) errors.push('Number of kids is required');
    if (!paymentMethod?.trim()) errors.push('Payment method is required');
    if (!roomId?.trim()) errors.push('Room ID is required');
    if (!checkIn?.trim()) errors.push('Check-in date is required');
    if (!checkOut?.trim()) errors.push('Check-out date is required');

    if (email && !isValidEmail(email)) errors.push('Invalid email format');
    if (phone && !isValidPhone(phone)) errors.push('Invalid phone number format');
    if (adults !== undefined && !isValidGuestCount(adults, kids)) {
        errors.push('Invalid number of guests (maximum 4 guests per room)');
    }
    if (paymentMethod && !isValidPaymentMethod(paymentMethod)) {
        errors.push('Invalid payment method');
    }
    if (checkIn && !isValidDate(checkIn)) errors.push('Invalid check-in date');
    if (checkOut && !isValidDate(checkOut)) errors.push('Invalid check-out date');
    if (checkIn && checkOut && !isValidDateRange(checkIn, checkOut)) {
        errors.push('Check-out date must be after check-in date');
    }
    if (checkIn && !isFutureDate(checkIn)) {
        errors.push('Check-in date must be in the future');
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
};

module.exports = {
    validateUserRegistration,
    validateUserUpdate,
    validateRoomCreation,
    validateBookingCreation
}; 
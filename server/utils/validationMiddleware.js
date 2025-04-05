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
    isValidRoomType
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
    const { roomNumber, type, price, capacity, status, description, amenities } = req.body;
    const errors = [];

    if (!roomNumber?.trim()) errors.push('Room number is required');
    if (!type?.trim()) errors.push('Room type is required');
    if (price === undefined) errors.push('Price is required');

    if (roomNumber && !isValidRoomNumber(roomNumber)) errors.push('Invalid room number');
    if (price !== undefined && !isValidPrice(price)) errors.push('Invalid price');
    if (type && !['STANDARD', 'DELUXE', 'SUITE'].includes(type)) errors.push('Invalid room type');
    if (status && !['AVAILABLE', 'BOOKED', 'MAINTENANCE'].includes(status)) errors.push('Invalid room status');
    if (capacity !== undefined && (typeof capacity !== 'number' || capacity < 1)) errors.push('Capacity must be a positive number');
    if (amenities && !Array.isArray(amenities)) errors.push('Amenities must be an array');
    if (amenities) {
        const validAmenities = ['WIFI', 'TV', 'AC', 'MINI_BAR', 'JACUZZI'];
        const invalidAmenities = amenities.filter(amenity => !validAmenities.includes(amenity));
        if (invalidAmenities.length > 0) {
            errors.push(`Invalid amenities: ${invalidAmenities.join(', ')}`);
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
};

// Booking validation middleware
const validateBooking = (req, res, next) => {
    const errors = [];
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
        checkOut
    } = req.body;

    // Required fields validation
    if (!fullName?.trim()) errors.push('Full name is required');
    if (!email?.trim()) errors.push('Email is required');
    if (!roomType?.trim()) errors.push('Room type is required');
    if (!roomPrice) errors.push('Room price is required');
    if (!roomId?.trim()) errors.push('Room ID is required');
    if (!checkIn?.trim()) errors.push('Check-in date is required');
    if (!checkOut?.trim()) errors.push('Check-out date is required');

    // Email format validation
    if (email && !isValidEmail(email)) {
        errors.push('Invalid email format');
    }

    // Phone format validation (if provided)
    if (phone && !isValidPhone(phone)) {
        errors.push('Invalid phone number format');
    }

    // Room type validation
    if (roomType && !isValidRoomType(roomType)) {
        errors.push('Invalid room type');
    }

    // Date validation
    if (checkIn && checkOut) {
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (checkInDate < today) {
            errors.push('Check-in date cannot be in the past');
        }

        if (checkOutDate <= checkInDate) {
            errors.push('Check-out date must be after check-in date');
        }
    }

    // Number validation
    if (adults && (!Number.isInteger(Number(adults)) || Number(adults) < 1)) {
        errors.push('Adults must be a positive integer');
    }

    if (kids && (!Number.isInteger(Number(kids)) || Number(kids) < 0)) {
        errors.push('Kids must be a non-negative integer');
    }

    if (roomPrice && (isNaN(Number(roomPrice)) || Number(roomPrice) <= 0)) {
        errors.push('Room price must be a positive number');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            errors
        });
    }

    next();
};

module.exports = {
    validateUserRegistration,
    validateUserUpdate,
    validateRoomCreation,
    validateBooking
}; 
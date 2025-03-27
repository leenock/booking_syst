const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Email validation
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Phone number validation (basic format)
const isValidPhone = (phone) => {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
};

// Password validation (at least 8 characters, 1 uppercase, 1 lowercase, 1 number)
const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return passwordRegex.test(password);
};

// Date validation
const isValidDate = (date) => {
    const parsedDate = new Date(date);
    return parsedDate instanceof Date && !isNaN(parsedDate);
};

// Check if date is in the future
const isFutureDate = (date) => {
    return new Date(date) > new Date();
};

// Check if date range is valid (end date after start date)
const isValidDateRange = (startDate, endDate) => {
    return new Date(endDate) > new Date(startDate);
};

// Check if email is unique
const isEmailUnique = async (email, excludeId = null) => {
    const where = { email };
    if (excludeId) {
        where.NOT = {
            id: excludeId
        };
    }

    const existingUser = await prisma.user.findFirst({
        where
    });
    return !existingUser;
};

// Check if phone is unique
const isPhoneUnique = async (phone, excludeId = null) => {
    const where = { phone };
    if (excludeId) {
        where.NOT = {
            id: excludeId
        };
    }

    const existingUser = await prisma.user.findFirst({
        where
    });
    return !existingUser;
};

// Room number validation
const isValidRoomNumber = (roomNumber) => {
    return typeof roomNumber === 'string' && roomNumber.trim().length > 0;
};

// Price validation
const isValidPrice = (price) => {
    return typeof price === 'number' && price > 0;
};

// Number of guests validation
const isValidGuestCount = (adults, kids) => {
    return (
        typeof adults === 'number' &&
        adults > 0 &&
        typeof kids === 'number' &&
        kids >= 0 &&
        adults + kids <= 4 // Maximum 4 guests per room
    );
};

// Payment method validation
const isValidPaymentMethod = (method) => {
    const validMethods = ['Credit Card', 'M-Pesa', 'Cash'];
    return validMethods.includes(method);
};

module.exports = {
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
}; 
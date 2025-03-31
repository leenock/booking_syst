const validateVisitor = (req, res, next) => {
  const { firstName, lastName, email, phone, password, isActive } = req.body;

  // Check required fields
  if (!firstName || !lastName || !email || !phone || !password) {
    return res.status(400).json({
      error: "Missing required fields",
      details: {
        firstName: !firstName ? "First name is required" : null,
        lastName: !lastName ? "Last name is required" : null,
        email: !email ? "Email is required" : null,
        phone: !phone ? "Phone is required" : null,
        password: !password ? "Password is required" : null,
      },
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: "Invalid email format",
    });
  }

  // Validate password length
  if (password.length < 6) {
    return res.status(400).json({
      error: "Password must be at least 6 characters long",
    });
  }

  // Validate phone number format (basic validation)
  const phoneRegex = /^\+?[\d\s-()]+$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({
      error: "Invalid phone number format",
    });
  }

  // Validate isActive is a boolean
  if (typeof isActive !== "boolean") {
    return res.status(400).json({
      error: "isActive must be a boolean value",
    });
  }

  next();
};

module.exports = {
  validateVisitor,
}; 
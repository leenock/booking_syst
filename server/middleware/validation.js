const validateVisitor = (req, res, next) => {
  const { firstName, lastName, email, phone, password, isActive } = req.body;
  const isUpdate = req.method === 'PUT';

  // For name-only updates, only validate firstName and lastName
  if (isUpdate && (!firstName || !lastName)) {
    return res.status(400).json({
      error: "Missing required fields",
      details: {
        firstName: !firstName ? "First name is required" : null,
        lastName: !lastName ? "Last name is required" : null,
      },
    });
  }

  // For full updates, validate all fields
  if (!isUpdate && (!firstName || !lastName || !email || !phone || !password)) {
    return res.status(400).json({
      error: "Missing-required fields",
      details: {
        firstName: !firstName ? "First name is required" : null,
        lastName: !lastName ? "Last name is required" : null,
        email: !email ? "Email is required" : null,
        phone: !phone ? "Phone is required" : null,
        password: !password ? "Password is required" : null,
      },
    });
  }

  // Validate email format if email is provided
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Invalid email format",
      });
    }
  }

  // Validate password length only for create operation
  if (!isUpdate && (!password || password.length < 6)) {
    return res.status(400).json({
      error: "Password must be at least 6 characters long",
    });
  }

  // Validate phone number format if phone is provided
  if (phone) {
    const phoneRegex = /^\+?[\d\s-()]+$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        error: "Invalid phone number format",
      });
    }
  }

  // Validate isActive is a boolean if provided
  if (isActive !== undefined && typeof isActive !== "boolean") {
    return res.status(400).json({
      error: "isActive must be a boolean value",
    });
  }

  next();
};

module.exports = {
  validateVisitor,
}; 
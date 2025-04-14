const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

// Get all visitors
const getAllVisitors = async (req, res) => {
  try {
    const visitors = await prisma.visitorAccount.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        isActive: true,
        createdAt: true,
      },
    });
    res.json(visitors);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch visitors" });
  }
};

// Get visitor by ID
const getVisitorById = async (req, res) => {
  try {
    const visitor = await prisma.visitorAccount.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        isActive: true,
        createdAt: true,
      },
    });
    if (!visitor) {
      return res.status(404).json({ error: "Visitor not found" });
    }
    res.json(visitor);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch visitor" });
  }
};

// Create new visitor
const createVisitor = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    // Validate required fields
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

    // Validate phone number format
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        error: "Invalid phone number format",
      });
    }

    // Check if visitor already exists
    const existingVisitor = await prisma.visitorAccount.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (existingVisitor) {
      return res.status(400).json({
        error: "Email or phone number already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const visitor = await prisma.visitorAccount.create({
      data: {
        id: uuidv4(),
        firstName,
        lastName,
        email,
        phone,
        password: hashedPassword,
        isActive: true,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        isActive: true,
        createdAt: true,
      },
    });

    res.status(201).json(visitor);
  } catch (error) {
    console.error("Create error:", error);
    res.status(500).json({ error: "Failed to create visitor" });
  }
};

// Update visitor
const updateVisitor = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phone, isActive } = req.body;

    // Check if visitor exists
    const existingVisitor = await prisma.visitorAccount.findUnique({
      where: { id },
    });

    if (!existingVisitor) {
      return res.status(404).json({ error: "Visitor not found" });
    }

    // Validate email format if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          error: "Invalid email format",
        });
      }
    }

    // Validate phone number format if provided
    if (phone) {
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({
          error: "Invalid phone number format",
        });
      }
    }

    // Check if email or phone is being changed and if it already exists ~ prevents duplicate emails or phone numbers by users.
    if (
      (email && email !== existingVisitor.email) ||
      (phone && phone !== existingVisitor.phone)
    ) {
      const existingVisitorWithSameContact =
        await prisma.visitorAccount.findFirst({
          where: {
            id: { not: id },
            OR: [
              { email: email || existingVisitor.email },
              { phone: phone || existingVisitor.phone },
            ],
          },
        });

      if (existingVisitorWithSameContact) {
        return res.status(400).json({
          error: "Email or phone number already exists",
        });
      }
    }

    // Prepare update data
    const updateData = {};

    // Only include fields that are provided in the request
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Update visitor
    const updatedVisitor = await prisma.visitorAccount.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        isActive: true,
        createdAt: true,
      },
    });

    res.json(updatedVisitor);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Failed to update visitor" });
  }
};

// Delete visitor
const deleteVisitor = async (req, res) => {
  try {
    const visitor = await prisma.visitorAccount.delete({
      where: { id: req.params.id },
    });
    if (!visitor) {
      return res.status(404).json({ error: "Visitor not found" });
    }
    res.json({ message: "Visitor deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete visitor" });
  }
};

// user login
const loginVisitor = async (req, res) => {
  try {
    let { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    email = email.trim().toLowerCase(); // normalize email

    // Find visitor by email
    const visitor = await prisma.visitorAccount.findUnique({
      where: { email },
    });

    if (!visitor) {
      return res.status(404).json({ error: "Visitor not found" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, visitor.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: visitor.id,
        email: visitor.email,
        isActive: visitor.isActive,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Return visitor info and token
    res.status(200).json({
      token,
      visitor: {
        id: visitor.id,
        firstName: visitor.firstName,
        lastName: visitor.lastName,
        email: visitor.email,
        phone: visitor.phone,
        isActive: visitor.isActive,
        createdAt: visitor.createdAt,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Failed to login visitor" });
  }
};

// user logout
const logoutVisitor = async (req, res) => {
  try {
    res.json({ message: "Visitor logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to logout visitor" });
  }
};

module.exports = {
  getAllVisitors,
  getVisitorById,
  createVisitor,
  updateVisitor,
  deleteVisitor,
  loginVisitor,
  logoutVisitor,
  // Add any other visitor-related functions here
};

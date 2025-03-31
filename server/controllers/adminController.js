const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Get all admins
const getAllAdmins = async (req, res) => {
  try {
    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    res.json(admins);
  } catch (error) {
    res.status(500).json({ error: "Error fetching admins" });
  }
};

// Get single admin by ID
const getAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await prisma.admin.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    res.json(admin);
  } catch (error) {
    res.status(500).json({ error: "Error fetching admin" });
  }
};

// Create new admin
const createAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      return res
        .status(400)
        .json({ error: "Admin with this email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const admin = await prisma.admin.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: role || "MODERATOR",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    res.status(201).json(admin);
  } catch (error) {
    res.status(500).json({ error: "Error creating admin" });
  }
};

// Update admin
const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, role } = req.body;

    // Check if admin exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { id },
    });

    if (!existingAdmin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    // Update admin
    const updatedAdmin = await prisma.admin.update({
      where: { id },
      data: {
        firstName,
        lastName,
        email,
        role,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    res.json(updatedAdmin);
  } catch (error) {
    res.status(500).json({ error: "Error updating admin" });
  }
};

// Delete admin
const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if admin exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { id },
    });

    if (!existingAdmin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    // Delete admin
    await prisma.admin.delete({
      where: { id },
    });

    res.json({ message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting admin" });
  }
};

// Admin login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin by email
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Return admin info and token
    res.json({
      token,
      admin: {
        id: admin.id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Error during login" });
  }
};

// Admin logout
const logoutAdmin = async (req, res) => {
  try {
    // Since we're using JWT tokens, we don't need to do anything server-side
    // The client will handle clearing the token
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error during logout" });
  }
};

module.exports = {
  getAllAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  loginAdmin,
  logoutAdmin,
};

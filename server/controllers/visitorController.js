const { PrismaClient } = require("@prisma/client");

require("dotenv").config(); // Load .env

const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const { Resend } = require("resend");

const nodemailer = require("nodemailer");

//const resend = new Resend(process.env.RESEND_API_KEY); // Not with NEXT_PUBLIC_

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

    // Send email after account creation

    // Node mailer transporter
    const transporter1 = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // e.g., yourname@gmail.com
        pass: process.env.EMAIL_PASS, // app password (not your real Gmail password)
      },
    });

    // Send the email
    await transporter1.sendMail({
      from: `"Vicarage Booking" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Account Has Been Created",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px;">
          <h2 style="color: #007BFF;">Welcome, ${firstName}!</h2>
          <p>Your account has been successfully created.</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Password:</strong> ${password}</p>
          <p>You can now log in to your account.</p>
          <hr />
          <p style="font-size: 0.9em; color: #888;">This email is for your records. Do not share it with anyone.</p>
        </div>
      `,
    });

    res.status(201).json(visitor);
  } catch (error) {
    console.error("Create error:", error);
    res.status(500).json({ error: "Failed to create visitor" });
  }
};

// update frontend visitor

const updateVisitorFrontend = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phone, password } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !password) {
      return res.status(400).json({
        error: "Missing required fields",
        details: {
          firstName: !firstName ? "First name is required" : null,
          lastName: !lastName ? "Last name is required" : null,
          //  email: !email ? "Email is required" : null,
          phone: !phone ? "Phone is required" : null,
          password: !password ? "Password is required" : null,
        },
      });
    }

    // Validate email format
    /*  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Invalid email format",
      });
    } */

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

    // Check if visitor exists
    const existingVisitor = await prisma.visitorAccount.findUnique({
      where: { id },
    });

    if (!existingVisitor) {
      return res.status(404).json({ error: "Visitor not found" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update visitor
    const updatedVisitor = await prisma.visitorAccount.update({
      where: { id },
      data: {
        firstName,
        lastName,
        //email,
        phone,
        password: hashedPassword,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        //email: true,
        phone: true,
        password: true,
        isActive: true,
        updatedAt: true,
      },
    });

    res.status(200).json(updatedVisitor);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Failed to update visitor" });
  }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Update visitor from admin side
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

// forgot password --- send email
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const visitor = await prisma.visitorAccount.findUnique({
      where: { email },
    });

    if (!visitor) {
      return res.status(404).json({ message: "Visitor not found" });
    }

    // Generate a JWT token for password reset
    const token = jwt.sign(
      { id: visitor.id, email: visitor.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    // Create reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/pages/auth/reset-password?token=${token}`;

    // Node mailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // e.g., yourname@gmail.com
        pass: process.env.EMAIL_PASS, // app password (not your real Gmail password)
      },
    });

    // Send the email
    await transporter.sendMail({
      from: `"Reset Password" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset your password",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto;">
          <h2>Password Reset Request</h2>
          <p>Hello ${visitor.name || "there"},</p>
          <p>Click the link below to reset your password:</p>
          <p><a href="${resetUrl}" style="color: #1a73e8;" target="_blank">Reset Password</a></p>
          <p>This link will expire in 1 hour.</p>
          <hr />
          <p style="font-size: 12px; color: #888;">If you didn’t request this, please ignore this email.</p>
        </div>
      `,
    });

    res.json({ message: "Password reset link sent to your email" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Failed to send password reset link" });
  }
};

// reset password
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Validate token and new password
    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ error: "Token and new password are required" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update visitor password
    const updatedVisitor = await prisma.visitorAccount.update({
      where: { id: decoded.id },
      data: { password: hashedPassword },
      select: { id: true, email: true },
    });
    //res.json(updatedVisitor);

    // Send confirmation email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    await transporter.sendMail({
      from: `"Password Reset Confirmation" <${process.env.EMAIL_USER}>`,
      to: updatedVisitor.email,
      subject: "Your password has been reset",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto;">
          <h2>Password Reset Successful</h2>
          <p>Hello,</p>
          <p>Your password has been successfully reset.</p>
          <p><strong>New Password:</strong> ${newPassword}</p>
          <p>If you did not request this change, please contact support immediately.</p>
        </div>
      `,
    });
    // Send success response
    res.json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: "Failed to reset password" });
  }
};

// Change password
module.exports = {
  getAllVisitors,
  getVisitorById,
  createVisitor,
  updateVisitorFrontend,
  updateVisitor,
  deleteVisitor,
  loginVisitor,
  logoutVisitor,
  forgotPassword,
  resetPassword,
  // Add any other visitor-related functions here
};

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Validate UUID
const isValidUUID = (uuid) => {
  return UUID_REGEX.test(uuid);
};

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
            }
        });
        res.json(visitors);
    } catch (error) {
        console.error("Error fetching visitors:", error);
        res.status(500).json({ error: 'Failed to fetch visitors' });
    }
};

// Get visitor by ID
const getVisitorById = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!isValidUUID(id)) {
            return res.status(400).json({ error: 'Invalid visitor ID format' });
        }

        const visitor = await prisma.visitorAccount.findUnique({
            where: { id },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                isActive: true,
                createdAt: true,
            }
        });

        if (!visitor) {
            return res.status(404).json({ error: 'Visitor not found' });
        }

        res.json(visitor);
    } catch (error) {
        console.error("Error fetching visitor:", error);
        res.status(500).json({ error: 'Failed to fetch visitor' });
    }
};

// Create new visitor
const createVisitor = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password, isActive } = req.body;

        // Check if visitor already exists
        const existingVisitor = await prisma.visitorAccount.findUnique({
            where: { email },
        });

        if (existingVisitor) {
            return res.status(400).json({ error: 'Visitor with this email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new visitor
        const visitor = await prisma.visitorAccount.create({
            data: {
                firstName,
                lastName,
                email,
                phone,
                password: hashedPassword,
                isActive,
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
        if (error.code === 'P2002') {
            console.warn("Duplicate entry detected (email or phone number already exists).");
            return res.status(400).json({ error: 'Email or phone number already exists' });
        }

        console.error("Unexpected error creating visitor:", error);
        res.status(500).json({ error: 'Failed to create visitor' });
    }
};

// Update visitor
const updateVisitor = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, email, phone, isActive } = req.body;

        if (!isValidUUID(id)) {
            return res.status(400).json({ error: 'Invalid visitor ID format' });
        }

        // Check if visitor exists
        const existingVisitor = await prisma.visitorAccount.findUnique({
            where: { id },
        });

        if (!existingVisitor) {
            return res.status(404).json({ error: 'Visitor not found' });
        }

        // Check if email is being changed and if it's already taken
        if (email !== existingVisitor.email) {
            const emailTaken = await prisma.visitorAccount.findUnique({
                where: { email },
            });

            if (emailTaken) {
                return res.status(400).json({ error: 'Email already in use' });
            }
        }

        // Update visitor
        const visitor = await prisma.visitorAccount.update({
            where: { id },
            data: {
                firstName,
                lastName,
                email,
                phone,
                isActive,
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

        res.json(visitor);
    } catch (error) {
        console.error("Error updating visitor:", error);
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Email or phone number already exists' });
        }
        res.status(500).json({ error: 'Failed to update visitor' });
    }
};

// Delete visitor
const deleteVisitor = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidUUID(id)) {
            return res.status(400).json({ error: 'Invalid visitor ID format' });
        }

        // Check if visitor exists
        const existingVisitor = await prisma.visitorAccount.findUnique({
            where: { id },
        });

        if (!existingVisitor) {
            return res.status(404).json({ error: 'Visitor not found' });
        }

        // Delete visitor
        await prisma.visitorAccount.delete({
            where: { id },
        });

        res.status(204).send();
    } catch (error) {
        console.error("Error deleting visitor:", error);
        res.status(500).json({ error: 'Failed to delete visitor' });
    }
};

module.exports = {
    getAllVisitors,
    getVisitorById,
    createVisitor,
    updateVisitor,
    deleteVisitor,
}; 
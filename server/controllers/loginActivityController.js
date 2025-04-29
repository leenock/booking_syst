const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create new login activity
const logLoginAttempt = async ({ email, ipAddress, device, status }) => {
  try {
    const entry = await prisma.loginActivity.create({
      data: {
        email,
        ipAddress,
        device,
        status,
      },
    });
    return entry;
  } catch (error) {
    console.error('Error logging login activity:', error);
    throw error;
  }
};

// Get latest login attempts (optional)
const getRecentLoginAttempts = async (req, res) => {
  try {
    const logs = await prisma.loginActivity.findMany({
      orderBy: { timestamp: 'desc' },
      take: 10,
    });
    res.json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch login attempts' });
  }
};

module.exports = {
  logLoginAttempt,
  getRecentLoginAttempts,
};

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create new login activity
// Create new login activity
const logLoginAttempt = async (req, res) => {
  const { email, ipAddress, device, status } = req.body; // Destructure from the request body

  if (!email || !ipAddress || !device || !status) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  try {
    const entry = await prisma.loginActivity.create({
      data: {
        email,
        ipAddress,
        device,
        status,
      },
    });
    res.status(201).json({ success: true, data: entry });
  } catch (error) {
    console.error('Error logging login activity:', error);
    res.status(500).json({ success: false, error: 'Failed to log login activity' });
  }
};


// Get latest login attempts (optional)
const getRecentLoginAttempts = async (req, res) => {
  try {
    const logs = await prisma.loginActivity.findMany({
      orderBy: { timestamp: 'desc' },
      take: 100,
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

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const roomRoutes = require('./routes/roomRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes');
const visitorRoutes = require('./routes/visitorRoutes');
const knowledgeRoutes = require('./routes/knowledgeRoutes');
const loginActivityRoutes = require('./routes/loginActivityRoutes');

const contactRoute = require('./routes/contact');

// Load environment variables
dotenv.config();

const app = express();

// Basic middleware - no authentication
app.use(cors());
app.use(express.json());

// Public Routes (No authentication required)
app.use('/api/admin', adminRoutes);

// Routes - no global authentication middleware
app.use('/api/rooms', roomRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/visitor-accounts', visitorRoutes);
// 
app.use('/api/visitor-accounts/users', visitorRoutes);

app.use('/api/knowledge-base', knowledgeRoutes);
app.use('/api/login-activity', loginActivityRoutes);

app.use('/api', contactRoute);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const path = require('path');
// Load env vars. Default location first.
require('dotenv').config();
// Fallback: try loading from server/.env relative to this file if not found
if (!process.env.JWT_SECRET) {
    require('dotenv').config({ path: path.join(__dirname, '../.env') });
}
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { initDb } = require('./database');
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Check for critical environment variables
// Check for critical environment variables with fallback
if (!process.env.JWT_SECRET) {
    console.warn('WARNING: JWT_SECRET is not defined. Using insecure fallback secret for development/demo purposes.');
    process.env.JWT_SECRET = 'fallback_insecure_secret_key_12345';
}

// Initialize Database
initDb();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Backend is running!', timestamp: new Date().toISOString() });
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../../client/dist')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

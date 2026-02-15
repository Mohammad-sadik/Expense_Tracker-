const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Bellcorp Expense Tracker API');
});

// Import routes
const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transactions');

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

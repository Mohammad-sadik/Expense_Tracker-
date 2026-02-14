const express = require('express');
const { Transaction } = require('../models');
const checkAuth = require('../middleware/authMiddleware');

const router = express.Router();

router.use(checkAuth); // Protect all routes

// Get all transactions with pagination and filtering
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { startDate, endDate, minAmount, maxAmount, category, search } = req.query;
        const { Op } = require('sequelize');

        const whereClause = { userId: req.userData.userId };

        // category filter
        if (category && category !== 'All') {
            whereClause.category = category;
        }

        // search filter
        if (search) {
            whereClause.title = { [Op.like]: `%${search}%` };
        }

        // Date range filter
        if (startDate || endDate) {
            whereClause.date = {};
            if (startDate) whereClause.date[Op.gte] = startDate;
            if (endDate) whereClause.date[Op.lte] = endDate;
        }

        // Amount range filter
        if (minAmount || maxAmount) {
            whereClause.amount = {};
            if (minAmount && !isNaN(parseFloat(minAmount))) whereClause.amount[Op.gte] = parseFloat(minAmount);
            if (maxAmount && !isNaN(parseFloat(maxAmount))) whereClause.amount[Op.lte] = parseFloat(maxAmount);
        }

        console.log('Querying transactions with:', whereClause);

        const { count, rows } = await Transaction.findAndCountAll({
            where: whereClause,
            order: [['date', 'DESC']],
            limit,
            offset
        });

        res.json({
            transactions: rows,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (err) {
        console.error('Error fetching transactions:', err);
        res.status(500).json({ error: err.message });
    }
});

// Get summary (totals and recent)
router.get('/summary', async (req, res) => {
    try {
        const { Op } = require('sequelize');

        const totalExpenses = await Transaction.sum('amount', {
            where: {
                userId: req.userData.userId,
                category: { [Op.ne]: 'Income' }
            }
        });

        const totalIncome = await Transaction.sum('amount', {
            where: {
                userId: req.userData.userId,
                category: 'Income'
            }
        });

        const recentTransactions = await Transaction.findAll({
            where: { userId: req.userData.userId },
            order: [['date', 'DESC']],
            limit: 5
        });

        const categories = await Transaction.findAll({
            attributes: [
                'category',
                [require('sequelize').fn('sum', require('sequelize').col('amount')), 'total']
            ],
            where: {
                userId: req.userData.userId,
                category: { [Op.ne]: 'Income' } // Exclude Income from expense breakdown
            },
            group: ['category']
        });

        res.json({
            totalExpenses: totalExpenses || 0,
            totalIncome: totalIncome || 0,
            recentTransactions,
            categoryBreakdown: categories
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



// Add transaction
router.post('/', async (req, res) => {
    try {
        const { title, amount, category, date, notes } = req.body;
        const transaction = await Transaction.create({
            title,
            amount,
            category,
            date,
            notes,
            userId: req.userData.userId
        });
        res.status(201).json(transaction);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update transaction
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, amount, category, date, notes } = req.body;

        const transaction = await Transaction.findOne({
            where: { id, userId: req.userData.userId }
        });

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found or unauthorized' });
        }

        transaction.title = title;
        transaction.amount = amount;
        transaction.category = category;
        transaction.date = date;
        transaction.notes = notes;

        await transaction.save();

        res.json(transaction);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete transaction
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Transaction.destroy({
            where: { id, userId: req.userData.userId }
        });

        if (result === 0) {
            return res.status(404).json({ message: 'Transaction not found or unauthorized' });
        }

        res.json({ message: 'Transaction deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

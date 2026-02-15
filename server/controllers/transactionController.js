const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

// @desc    Get transactions
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const { startDate, endDate, minAmount, maxAmount, category, search } = req.query;

        const query = { user: req.user.id };

        // Category filter
        if (category && category !== 'All') {
            query.category = category;
        }

        // Search filter
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { notes: { $regex: search, $options: 'i' } }
            ];
        }

        // Date range filter
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        // Amount range filter
        if (minAmount || maxAmount) {
            query.amount = {};
            if (minAmount) query.amount.$gte = Number(minAmount);
            if (maxAmount) query.amount.$lte = Number(maxAmount);
        }

        const transactions = await Transaction.find(query)
            .sort({ date: -1 }) // Sort by date descending
            .skip(skip)
            .limit(limit);

        const total = await Transaction.countDocuments(query);

        res.status(200).json({
            transactions,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalTransactions: total
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get transaction summary (Dashboard)
// @route   GET /api/transactions/summary
// @access  Private
const getTransactionSummary = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);

        // Aggregation for totals
        const totals = await Transaction.aggregate([
            { $match: { user: userId } },
            {
                $group: {
                    _id: null,
                    totalIncome: {
                        $sum: {
                            $cond: [{ $eq: ['$category', 'Income'] }, '$amount', 0]
                        }
                    },
                    totalExpenses: {
                        $sum: {
                            $cond: [{ $ne: ['$category', 'Income'] }, '$amount', 0]
                        }
                    }
                }
            }
        ]);

        const totalIncome = totals.length > 0 ? totals[0].totalIncome : 0;
        const totalExpenses = totals.length > 0 ? totals[0].totalExpenses : 0;

        // Recent transactions
        const recentTransactions = await Transaction.find({ user: userId })
            .sort({ date: -1 })
            .limit(5);

        // Category Breakdown
        const categoryBreakdown = await Transaction.aggregate([
            {
                $match: {
                    user: userId,
                    category: { $ne: 'Income' }
                }
            },
            {
                $group: {
                    _id: '$category',
                    total: { $sum: '$amount' }
                }
            },
            {
                $project: {
                    category: '$_id',
                    total: 1,
                    _id: 0
                }
            }
        ]);

        res.status(200).json({
            totalIncome,
            totalExpenses,
            totalBalance: totalIncome - totalExpenses,
            recentTransactions,
            categoryBreakdown
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Set transaction
// @route   POST /api/transactions
// @access  Private
const setTransaction = async (req, res) => {
    if (!req.body.title || !req.body.amount || !req.body.category) {
        res.status(400);
        throw new Error('Please add title, amount and category');
    }

    const transaction = await Transaction.create({
        user: req.user.id,
        title: req.body.title,
        amount: req.body.amount,
        category: req.body.category,
        date: req.body.date,
        notes: req.body.notes
    });

    res.status(200).json(transaction);
};

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
const updateTransaction = async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
        res.status(400);
        throw new Error('Transaction not found');
    }

    // Check for user
    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    // Make sure the logged in user matches the transaction user
    if (transaction.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
        }
    );

    res.status(200).json(updatedTransaction);
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
        res.status(400);
        throw new Error('Transaction not found');
    }

    // Check for user
    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    // Make sure the logged in user matches the transaction user
    if (transaction.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    await transaction.deleteOne();

    res.status(200).json({ id: req.params.id });
};

module.exports = {
    getTransactions,
    setTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionSummary
};

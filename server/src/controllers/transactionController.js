const TransactionModel = require('../models/transactionModel');

const createTransaction = async (req, res) => {
    const { title, amount, category, date, notes } = req.body;
    const user_id = req.user.id;

    if (!title || !amount || !category || !date) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    try {
        const newTransaction = await TransactionModel.create({
            user_id,
            title,
            amount: parseFloat(amount),
            category,
            date,
            notes
        });
        res.status(201).json(newTransaction);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error creating transaction' });
    }
};

const getTransactions = async (req, res) => {
    const user_id = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search;
    const category = req.query.category;
    const minAmount = req.query.min;
    const maxAmount = req.query.max;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    try {
        const result = await TransactionModel.findAll({
            userId: user_id,
            page,
            limit,
            search,
            category,
            minAmount,
            maxAmount,
            startDate,
            endDate
        });
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching transactions' });
    }
};

const getTransactionById = async (req, res) => {
    const user_id = req.user.id;
    const id = req.params.id;

    try {
        const transaction = await TransactionModel.findById(id, user_id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.json(transaction);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateTransaction = async (req, res) => {
    const user_id = req.user.id;
    const id = req.params.id;
    const { title, amount, category, date, notes } = req.body;

    if (!title || !amount || !category || !date) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    try {
        const updated = await TransactionModel.update(id, user_id, {
            title,
            amount: parseFloat(amount),
            category,
            date,
            notes
        });

        if (!updated) {
            return res.status(404).json({ message: 'Transaction not found or unauthorized' });
        }

        res.json({ message: 'Transaction updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error updating transaction' });
    }
};

const deleteTransaction = async (req, res) => {
    const user_id = req.user.id;
    const id = req.params.id;

    try {
        const deleted = await TransactionModel.delete(id, user_id);
        if (!deleted) {
            return res.status(404).json({ message: 'Transaction not found or unauthorized' });
        }
        res.json({ message: 'Transaction deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error deleting transaction' });
    }
};

const getDashboardData = async (req, res) => {
    const user_id = req.user.id;
    try {
        const data = await TransactionModel.getDashboardData(user_id);
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching dashboard data' });
    }
};

module.exports = {
    createTransaction,
    getTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
    getDashboardData
};

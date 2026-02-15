const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
    createTransaction,
    getTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
    getDashboardData
} = require('../controllers/transactionController');

router.use(authMiddleware); // All routes require authentication

router.post('/', createTransaction);
router.get('/', getTransactions);
router.get('/dashboard', getDashboardData); // Dashboard endpoint
router.get('/:id', getTransactionById);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

module.exports = router;

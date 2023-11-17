const { Router } = require('express');
const router = Router();

const {
    getAllTransactions,
    getSpecificTransaction,
    getTransactionsForEnvelope,
    createTransaction,
    deleteTransaction
} = require('../Controllers/transactions.js');

router.get('/', getAllTransactions);

router.get('/txn/:id', getSpecificTransaction);

router.get('/envelope/:id', getTransactionsForEnvelope);

router.post('/', createTransaction);

router.delete('/:id', deleteTransaction);

module.exports = router;
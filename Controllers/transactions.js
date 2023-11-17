const db = require('../db.js');

const getAllTransactions = async (req, res) => {
    const queryString = 'SELECT * FROM TRANSACTIONS';
    try {
        const result = await db.query(queryString);

        if (result.rowCount < 1) {
            return res.status(404).send({
                message: 'No transactions found'
            });
        };

        return res.send({
            status: 'Success',
            message: 'Transactions returned',
            data: result.rows
        });
    } catch (err) {
        return res.status(500).send({
            error: err.message
        });
    };
};

const getSpecificTransaction = async (req, res) => {
    const { id } = req.params;
    const queryString = 'SELECT * FROM TRANSACTIONS WHERE TRANSACTION_ID = $1';
    const parameters = [id];

    try {
        const result = await db.query(queryString, parameters);

        if (result.rowCount < 1) {
            return res.status(404).send({
                message: 'Transaction not found'
            });
        };
        
        return res.send({
            status: 'Success',
            message: 'Specific transaction found',
            data: result.rows[0]
        });
    } catch (err) {
        return res.status(500).send({
            error: err.message
        });
    };
};

const getTransactionsForEnvelope = async (req, res) => {
    const queryString = 'SELECT * FROM TRANSACTIONS WHERE ENVELOPE_ID = $1';
    const parameters = [req.params.id];
    try {
        const result = await db.query(queryString, parameters);

        if (result.rowCount < 1) {
            return res.status(404).send({
                message: 'Transaction not found'
            });
        };

        return res.send({
            status: 'Success',
            message: 'Found transactions for envelope',
            data: result.rows
        });
    } catch (err) {
        return res.status(500).send({
            error: err.message
        });
    }
    
};

const getMaxTransactionId = async () => {
    const queryString = 'SELECT COALESCE(MAX(TRANSACTION_ID), 0) as MAX_ID FROM TRANSACTIONS';
    const result = await db.query(queryString);
    return result;    
};

const createTransaction = async (req, res) => {
    const { envelopeId, amount, debitCredit, recipient } = req.body;
    const transactionDateTime = new Date();
    const transactionString = 'INSERT INTO TRANSACTIONS VALUES ($1, $2, $3, $4, $5, $6)';
    const validateEnvelopeBalanceString = `SELECT BALANCE FROM ENVELOPES WHERE ENVELOPE_ID = $1`;
    const envelopeString = `UPDATE ENVELOPES SET BALANCE = (CASE WHEN $2 = 'D' THEN BALANCE - $1 ELSE BALANCE + $1 END) WHERE ENVELOPE_ID = $3`;

    try {
        const maxId = await getMaxTransactionId();
        const newId = maxId.rows[0].max_id+1;

        const validTransaction = await db.query(validateEnvelopeBalanceString, [envelopeId]);

        if (parseFloat(validTransaction.rows[0].balance) < amount) {
            return res.status(401).send({
                status: 'Failed',
                message: 'Envelope does not have enough balance for this transaction'
            });
        };

        const transactionParameters = [newId, envelopeId, amount, debitCredit, transactionDateTime, recipient];
        const envelopeParameters = [amount, debitCredit, envelopeId];

        await db.query('BEGIN');

        const transactionResult = await db.query(transactionString, transactionParameters);
        const envelopeResult = await db.query(envelopeString, envelopeParameters);

        await db.query('COMMIT');

        return res.send({
            status: 'Success',
            message: 'Transaction has been created',
            data: newId
        });
    } catch (err) {
        await db.query('ROLLBACK');

        return res.status(500).send({
            error: err.message
        });
    };  
};

const deleteTransaction = async (req, res) => {
    const { id } = req.params;

    const transactionQuery = 'SELECT * FROM TRANSACTIONS WHERE TRANSACTION_ID = $1';
    const deleteQuery = 'DELETE FROM TRANSACTIONS WHERE TRANSACTION_ID = $1';
    const updateQuery = `UPDATE ENVELOPES SET BALANCE = (CASE WHEN $2 = 'D' THEN BALANCE - $1 ELSE BALANCE + $1 END) WHERE ENVELOPE_ID = $3`;

    try {
        await db.query('BEGIN');

        const transactionRun = await db.query(transactionQuery, [id]);

        const { transaction_id, envelope_id, transaction_amount_absolute, debit_credit} = transactionRun.rows[0];

        const deleteParameters = [transaction_id];
        const updateParameters = [transaction_amount_absolute, debit_credit, envelope_id];

        const deleteRun = await db.query(deleteQuery, deleteParameters);
        const updateRun = await db.query(updateQuery, updateParameters);

        await db.query('COMMIT');

        return res.send({
            status: 'Success',
            message: 'Transaction has been deleted'
        });
    } catch (err) {
        await db.query('ROLLBACK');

        return res.status(500).send({
            error: err.message
        });
    };  
};

module.exports = {
    getAllTransactions,
    getSpecificTransaction,
    getTransactionsForEnvelope,
    createTransaction,
    deleteTransaction
};
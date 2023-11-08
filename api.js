const { Router } = require('express');
const api = Router();

const envelopeRouter = require('./Routes/envelopes.js');
const transactionRouter = require('./Routes/transactions.js');

api.use('/envelopes', envelopeRouter);
api.use('/transactions', transactionRouter);

module.exports = api;
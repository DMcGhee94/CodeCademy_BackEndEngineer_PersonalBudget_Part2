const express = require('express');
const app = express();
const port = 3000;

const db = require('./db.js');

db.query(`
    CREATE  TABLE IF NOT EXISTS ENVELOPES (
        ENVELOPE_ID integer primary key,
        ENVELOPE_NAME varchar(30) NOT NULL,
        BALANCE numeric(20, 2) NOT NULL
    );
    CREATE  TABLE IF NOT EXISTS TRANSACTIONS (
        TRANSACTION_ID integer primary key,
        ENVELOPE_ID integer references ENVELOPES (ENVELOPE_ID),
        TRANSACTION_AMOUNT_ABSOLUTE numeric(20, 2) NOT NULL,
        DEBIT_CREDIT char(1) NOT NULL,
        TRANSACTION_DATETIME TIMESTAMP NOT NULL,
        RECIPIENT varchar(100) NOT NULL
    );
`);

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const apiRouter = require('./api.js');
app.use('/api', apiRouter);

app.get('/', (req, res) => {
    return res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
});
const express = require('express');
const app = express();
const port = 3000;

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
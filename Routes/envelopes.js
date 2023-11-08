const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => {
    res.send('Using /api/envelopes route');
});

router.get('/:id', (req, res) => {
    res.send('Will be used to return a specific envelope');
});

router.post('/', (req, res) => {
    res.send('Will be used to create a new envelope');
});

router.delete('/:id', (req, res) => {
    res.send('Will be used to delete an envelope');
});

router.put('/:id', (req, res) => {
    res.send('Will be used to update an envelope');
});

module.exports = router;
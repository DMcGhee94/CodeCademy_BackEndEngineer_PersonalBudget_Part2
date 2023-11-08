const { Router } = require('express');
const router = Router();

const {
    getAllEnvelopes,
    getSpecificEnvelope,
    createNewEnvelope,
    deleteEnvelope,
    updateEnvelope
} = require('../Controllers/envelopes.js');

router.get('/', async (req, res) => {
    const result = await getAllEnvelopes();
    res.send(result.rows);
});

router.get('/:id', async (req, res) => {
    const result = await getSpecificEnvelope(req.params.id);
    res.send(result.rows[0]);
});

router.post('/', async (req, res) => {
    const result = await createNewEnvelope(req.body.name, req.body.startingBalance);
    res.status(201).send(`Successfully created with ID: ${result}`);
});

router.delete('/:id', async (req, res) => {
    const result = await deleteEnvelope(req.params.id);
    res.send(`Successfully deleted envelope with ID: ${req.params.id}`);
});

router.put('/:id', async (req, res) => {
    const result = await updateEnvelope(req.params.id, req.body);
    res.send(result.rows[0]);
});

module.exports = router;
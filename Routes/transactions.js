const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => {
    res.send('Using /api/transactions route');
});

module.exports = router;
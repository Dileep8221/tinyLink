// src/routes/web.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/webController');

// GET / -> dashboard (HTML)
router.get('/', ctrl.dashboardPage);

// GET /code/:code -> stats page (HTML)
router.get('/code/:code', ctrl.statsPage);

// GET /:code -> redirect (must be last - catch-all)
router.get('/:code', ctrl.redirectHandler);

module.exports = router;

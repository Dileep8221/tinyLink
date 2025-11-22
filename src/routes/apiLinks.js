// src/routes/apiLinks.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/apiLinksController');

// POST /api/links
router.post('/', ctrl.create);

// GET /api/links
router.get('/', ctrl.list);

// GET /api/links/:code
router.get('/:code', ctrl.getOne);

// DELETE /api/links/:code
router.delete('/:code', ctrl.remove);

module.exports = router;

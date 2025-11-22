// src/routes/web.js
const express = require('express');
const router = express.Router();

// Import the controller module (ensure the path is correct)
const webController = require('../controllers/webController');

// Defensive check — fail fast with helpful error if a handler is missing
function checkHandler(name) {
  if (!webController || typeof webController[name] !== 'function') {
    throw new Error(`webController.${name} is not a function or not exported. Check src/controllers/webController.js`);
  }
}

// Register routes
checkHandler('dashboardPage');
router.get('/', webController.dashboardPage);

checkHandler('statsPage');
router.get('/code/:code', webController.statsPage);

checkHandler('redirectHandler');
router.get('/:code', webController.redirectHandler);

module.exports = router;

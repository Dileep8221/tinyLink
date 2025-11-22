// src/controllers/webController.js (excerpt)
const linkModel = require('../models/linkModel');

async function dashboardPage(req, res) {
  try {
    const links = await linkModel.listLinks();
    return res.render('dashboard', { links, baseUrl: process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}` });
  } catch (err) {
    // If the links table doesn't exist yet, log a friendly message and show empty dashboard
    console.error('Dashboard load error (non-fatal):', err.message || err);
    // optionally: inspect err.code === '42P01' for missing relation and log differently
    return res.render('dashboard', { links: [], baseUrl: process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`, warning: 'Database not ready — no links yet.' });
  }
}

module.exports = { dashboardPage, /* ... */ };

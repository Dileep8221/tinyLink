// src/controllers/webController.js
const linkModel = require('../models/linkModel');

async function dashboardPage(req, res) {
  try {
    const links = await linkModel.listLinks();
    res.render('dashboard', { links, baseUrl: process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}` });
  } catch (err) {
    console.error('Dashboard load error (non-fatal):', err.message || err);
    return res.render('dashboard', { links: [], baseUrl: process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`, warning: 'Database not ready — no links yet.' });
  }
}

async function statsPage(req, res) {
  const { code } = req.params;
  try {
    const link = await linkModel.getLinkByCode(code);
    if (!link) return res.status(404).render('404', { message: 'Not found' });
    return res.render('stats', { link, baseUrl: process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}` });
  } catch (err) {
    console.error('Stats error:', err);
    return res.status(500).render('error', { message: 'Server error' });
  }
}

async function redirectHandler(req, res) {
  const { code } = req.params;
  try {
    const updated = await linkModel.incrementClickAndGet(code); // must return row or null
    if (!updated) return res.status(404).send('Not found');
    res.redirect(302, updated.target_url);
  } catch (err) {
    console.error('Redirect error:', err);
    return res.status(500).send('Server error');
  }
}

module.exports = {
  dashboardPage,
  statsPage,
  redirectHandler,
};

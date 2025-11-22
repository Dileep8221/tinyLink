// src/controllers/webController.js
const linkModel = require('../models/linkModel');

async function dashboardPage(req, res) {
  const links = await linkModel.listLinks();
  const baseUrl = process.env.BASE_URL || '';
  res.render('dashboard', { links, baseUrl });
}

async function statsPage(req, res) {
  const { code } = req.params;
  const link = await linkModel.getLinkByCode(code);
  if (!link) {
    return res.status(404).send('Not found');
  }
  const baseUrl = process.env.BASE_URL || '';
  res.render('stats', { link, baseUrl });
}

async function redirectHandler(req, res) {
  const { code } = req.params;
  // increment clicks and get target atomically
  const row = await linkModel.incrementClicksAndGet(code);
  if (!row) {
    return res.status(404).send('Not found');
  }
  // send 302 redirect with Location header
  res.set('Location', row.target_url);
  return res.redirect(302, row.target_url);
}

module.exports = { dashboardPage, statsPage, redirectHandler };

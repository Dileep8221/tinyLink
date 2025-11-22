// src/controllers/apiLinksController.js
const linkModel = require('../models/linkModel');
const { isValidUrl } = require('../utils/validateUrl');

async function create(req, res) {
  const { target_url, code } = req.body || {};

  if (!target_url || !isValidUrl(target_url)) {
    return res.status(400).json({ error: 'target_url is required and must be a valid URL with scheme' });
  }

  try {
    const created = await linkModel.createLink({ code, target_url });
    return res.status(201).json(created);
  } catch (e) {
    if (e.status === 409) {
      return res.status(409).json({ error: 'code already exists' });
    }
    if (e.status === 400) {
      return res.status(400).json({ error: e.message });
    }
    console.error(e);
    return res.status(500).json({ error: 'internal server error' });
  }
}

async function list(req, res) {
  const rows = await linkModel.listLinks();
  return res.status(200).json(rows);
}

async function getOne(req, res) {
  const { code } = req.params;
  const link = await linkModel.getLinkByCode(code);
  if (!link) return res.status(404).json({ error: 'Not found' });
  return res.status(200).json(link);
}

async function remove(req, res) {
  const { code } = req.params;
  const deleted = await linkModel.deleteLinkByCode(code);
  if (!deleted) return res.status(404).json({ error: 'Not found' });
  // spec allows 204 or 200 { ok: true } - choose 204 No Content
  return res.status(204).send();
}

module.exports = { create, list, getOne, remove };

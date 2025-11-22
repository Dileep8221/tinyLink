// src/models/linkModel.js
const db = require('../../db');

const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/;

async function createLink({ code, target_url }) {
  // if code not provided, generate 6-8 random alphanumeric code
  if (!code) {
    // simple 7-char generator
    code = (Math.random().toString(36).slice(2, 9)).replace(/[^A-Za-z0-9]/g, '').slice(0,7);
  }

  if (!CODE_REGEX.test(code)) {
    const err = new Error('code must match ^[A-Za-z0-9]{6,8}$');
    err.status = 400;
    throw err;
  }

  const sql = `
    INSERT INTO links (code, target_url)
    VALUES ($1, $2)
    RETURNING id, code, target_url, total_clicks, created_at, last_clicked
  `;
  try {
    const { rows } = await db.query(sql, [code, target_url]);
    return rows[0];
  } catch (e) {
    // Postgres unique violation
    if (e.code === '23505') {
      const err = new Error('code already exists');
      err.status = 409;
      throw err;
    }
    throw e;
  }
}

async function listLinks() {
  const { rows } = await db.query(
    `SELECT id, code, target_url, total_clicks, created_at, last_clicked FROM links ORDER BY created_at DESC`
  );
  return rows;
}

async function getLinkByCode(code) {
  const { rows } = await db.query(
    `SELECT id, code, target_url, total_clicks, created_at, last_clicked FROM links WHERE code = $1`,
    [code]
  );
  return rows[0];
}

async function deleteLinkByCode(code) {
  const { rowCount } = await db.query(`DELETE FROM links WHERE code = $1`, [code]);
  return rowCount > 0;
}

async function incrementClicksAndGet(code) {
  // Atomic update: increment total_clicks and set last_clicked
  const sql = `
    UPDATE links
    SET total_clicks = total_clicks + 1,
        last_clicked = now()
    WHERE code = $1
    RETURNING target_url, total_clicks, last_clicked
  `;
  const { rows } = await db.query(sql, [code]);
  return rows[0];
}

module.exports = {
  createLink,
  listLinks,
  getLinkByCode,
  deleteLinkByCode,
  incrementClicksAndGet,
  CODE_REGEX
};

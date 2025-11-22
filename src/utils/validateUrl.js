// src/utils/validateUrl.js
function isValidUrl(urlString) {
  try {
    const u = new URL(urlString);
    // require http or https
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch (e) {
    return false;
  }
}

module.exports = { isValidUrl };

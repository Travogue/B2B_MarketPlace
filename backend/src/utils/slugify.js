const slugify = require('slugify');

const createSlug = (text) =>
  slugify(text, { lower: true, strict: true, trim: true });

module.exports = { createSlug };

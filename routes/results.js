const express = require('express');
const router = express.Router();
const models = require('../models');

/* GET results. */
router.get('/', async function(req, res, next) {
  let results = await models.result.findAll();
  res.json({results: results});
});

module.exports = router;

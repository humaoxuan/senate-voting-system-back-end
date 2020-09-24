const express = require('express');
const router = express.Router();
const models = require('../models');

/* GET home page. */
router.get('/', async function(req, res, next) {
    let candidates = await models.candidate.findAll();
    res.json({candidates:candidates});
});

module.exports = router;

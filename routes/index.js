const express = require('express');
const router = express.Router();

/* GET csrf. */
router.get('/', function(req, res, next) {
  res.sendFile(__dirname+'home.html');
});

module.exports = router;

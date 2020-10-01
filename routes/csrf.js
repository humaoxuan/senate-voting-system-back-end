const express = require('express');
const router = express.Router();

/* GET csrf. */
router.get('/', function(req, res, next) {
  res.json({csrfToken: req.csrfToken()});
});

module.exports = router;

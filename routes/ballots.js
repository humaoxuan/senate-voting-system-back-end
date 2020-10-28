const express = require('express');
const router = express.Router();
const models = require('../models');
const encrypt = require('../utils/encrypt')

/* POST ADD */
router.post('/', async function (req, res, next) {
    let ballot = req.body;
    let preferences = JSON.parse(req.body.preferences);
    ballot.preferences = JSON.stringify(preferences);

    // insert into database
    try {
        ballot = await models.ballot.create(ballot);
    } catch (err) {
        // failed to insert into database
        // could be database connection error or input not correct
        res.json({status: "error", msg: "input not correct or database connection error"});
        return;
    }

    // insert success
    res.json({
        status: "success"
        , user: {
            id: ballot['id']
        }
    });

});

module.exports = router;

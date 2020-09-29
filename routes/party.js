const express = require('express');
const router = express.Router();
const models = require('../models');
const encrypt = require('../utils/encrypt')

/* GET home page. */
router.get('/', async function(req, res, next) {
    let party = await models.party.findAll();
    res.json({party:party});
});

/* POST ADD */
router.post('/', async function (req, res, next) {
    let party = req.body;

    // check if the party name exist in database
    // @param {json} [dbRes] response json from database
    let dbRes = await models.party.findAndCountAll({
        where: {
            party: req.body['party']
        }
    })

    // driver license, passport or email already exist in database
    if (dbRes['count'] != 0) {
        res.json({
            status: "error", description: "Party name already exist in database"
        });
        return;
    }

    // encrypt password
    //user['password'] = await encrypt.encrypt(user['password']);

    // insert into database
    try {
        party = await models.party.create(req.body);
    } catch (err) {
        console.log(err);
        // failed to insert into database
        // could be database connection error or input not correct
        res.json({status: "error", description: "input not correct or database connection error"});
        return;
    }

    // insert success
    res.json({
        status: "success"
        , party: {
            id: party['id']
        }
    });

});

/* PATCH UPDATE */
router.patch('/party', async function (req, res, next) {
    await models.party.update({partyName: await req.body['partyName']}, {
        where: {
            partyName: req.body['partyName']
        }
    });
});

module.exports = router;

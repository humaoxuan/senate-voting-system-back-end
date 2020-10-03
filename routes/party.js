const express = require('express');
const router = express.Router();
const models = require('../models');
const encrypt = require('../utils/encrypt')

/* GET home page. */
router.get('/', async function (req, res, next) {
    let party = await models.party.findAll();
    res.json({party: party});
});

/* POST ADD */
router.post('/', async function (req, res, next) {
    let party = req.body;

    // check if the party name exist in database
    // @param {json} [dbRes] response json from database
    let dbRes = await models.party.findAndCountAll({
        where: {
            partyName: req.body['partyName']
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

/* PUT UPDATE */
router.put('/', async function (req, res, next) {
    //let newName = req.body['newName'];
    //update the old party name

    let dbRes = await models.party.update({
        partyName: req.body['newName'],
    }, {
        where: {partyName: req.body['partyName']},
        returning: true
    })

    //console.log(dbRes);

    //update success
    //Check if the update result is 0 or not, 0 show update success or not
    if (dbRes[0] === 0) {
        res.json({
            status: "error", description: "Can not find party name"
        });
        return;
    }
    res.json({
        status: "success"
    });

});

/* DELETE DELETE USELESS PARTY INFORMATION */
router.delete('/', async function (req, res, next) {
    //let newName = req.body['newName'];
    //update the old party name

    let dbRes = await models.party.destroy(
     {
        where: {partyName: req.body['partyName']},
        returning: true
    })

    //console.log(dbRes);

    //delete success
    //Check if the delete result is 0 or not, 0 show delete success or not
    if (dbRes === 0) {
        res.json({
            status: "error", description: "Can not find party name"
        });
        return;
    }
    if(dbRes === 1) {
        res.json({
            status: "success"
        });
        return;
    }

});


module.exports = router;

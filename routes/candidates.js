const express = require('express');
const router = express.Router();
const models = require('../models');

/* GET home page. */
router.get('/', async function(req, res, next) {
    let candidates = await models.candidate.findAll();
    res.json({candidates:candidates});
});

/* POST ADD Candidate name */
router.post('/', async function(req, res, next){
    let candidates = req.body;

    // check if the candidate's name and candidate's party name exist in database
    // @param {json} [dbRes] response json from database
    let dbRes = await models.user.findAndCountAll({
        where: {
            name: req.body['name']
            //party: req.body['party']
        }
    })

    // candidate's name and candidate's party name already exist in database
    if (dbRes['count'] != 0) {
        res.json({
            status: "error", description: "candidate's name  already exist in database"
        });
        return;
    }

    // encrypt password
    //user['password'] = await encrypt.encrypt(user['password']);

    // insert into database
    try {
        user = await models.user.create(req.body);
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
        , candidates: {
            name: candidates['name']
            //party: candidates['party']
        }
    });



});

/* POST ADD party name*/
router.post('/party', async function(req, res, next){
    let candidates = req.body;

    // check if the candidate's name and candidate's party name exist in database
    // @param {json} [dbRes] response json from database
    let dbRes = await models.party.findAndCountAll({
        where: {
            party: req.body['party']
        }
    })

    // candidate's name and candidate's party name already exist in database
    if (dbRes['count'] != 0) {
        res.json({
            status: "error", description: "candidate's party name already exist in database"
        });
        return;
    }

    // encrypt password
    //user['password'] = await encrypt.encrypt(user['password']);

    // insert into database
    try {
        user = await models.user.create(req.body);
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
        , candidates: {
            party: candidates['party']
        }
    });



});

/* PATCH UPDATE */
router.patch('/name', async function (req, res, next) {
    await models.user.update({name: await req.body['name']}, {
        where: {
            id: req.body['id']
        }
    });
});

router.patch('/party', async function (req, res, next) {
    await models.user.update({party: await req.body['party']}, {
        where: {
            id: req.body['id']
        }
    });
});

module.exports = router;

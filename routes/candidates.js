const express = require('express');
const router = express.Router();
const models = require('../models');

/* GET home page. */
router.get('/:name', async function (req, res, next) {
    const candidates = await models.candidate.findByPk(req.params.name);
    if (candidates === null) {
        console.log('Not found!');
    } else {
        console.log(candidates instanceof models.candidate); // true
        // 它的主键是 123
    }
    //let candidates = await models.candidate.findAll();
    res.json({candidates:candidates});
});

/* POST ADD Candidate name， party ID and area name */
router.post('/', async function (req, res, next) {
    let candidates = req.body;

    // check if the candidate's name and candidate's party name exist in database
    // @param {json} [dbRes] response json from database
    let dbRes = await models.candidate.findAndCountAll({
        where: {
            name: req.body['candidateName'],
            party: req.body['partyID']
            //:req.body['areaName']
        }
    })

    // candidate's name and candidate's party name already exist in database
    if (dbRes['count'] != 0) {
        res.json({
            status: "error", description: "candidate's name  already exist in database"
        });
        return;
    }

    // insert into database
    try {
        candidates = await models.candidate.create({
            name: req.body.candidateName,
            party: req.body.partyID
            //area:req.body.areaName
            //votes: 0
        });
    } catch (err) {
        console.log(err);
        // failed to insert into database
        // could be database connection error or input not correct
        res.json({status: "error", description: "input not correct or database connection error"});
        return;
    }

    // add success
    res.json({
        status: "success"
        , candidates:{candidates}
    });


});


/* PUT UPDATE */
router.put('/', async function (req, res, next) {
    let dbRes = await models.candidate.update({
        party: req.body['newpartyID'],
    }, {
        where: {
            name: req.body['candidateName'],
            party: req.body['partyID']
        },
        returning: true
    })

    //console.log(dbRes);

    //update success
    if (dbRes[0] === 0) {
        res.json({
            status: "error", description: "Can not find party name"
        });
        return;
    }
    res.json({
        status: "success"
        , description: "Update Completed"
    });
});


module.exports = router;

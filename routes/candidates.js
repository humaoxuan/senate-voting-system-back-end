const express = require('express');
const router = express.Router();
const models = require('../models');

/* GET All candidates information. */
router.get('/', async function (req, res, next) {
    let candidates = await models.candidate.findAll();
    res.json({candidates: candidates});
});

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
            party: req.body['party'],
            state: req.body['state']
        }
    })

    // candidate's name and candidate's party name already exist in database
    if (dbRes['count'] != 0) {
        res.json({
            status: "error", msg: "candidate's name  already exist in database"
        });
        return;
    }

    // insert into database
    try {
        candidates = await models.candidate.create({
            name: req.body.candidateName,
            party: req.body.party,
            state: req.body['state']
        });
    } catch (err) {
        console.log(err);
        // failed to insert into database
        // could be database connection error or input not correct
        res.json({status: "error", msg: "input not correct or database connection error"});
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
        party: req.body['newParty'],
    }, {
        where: {
            name: req.body['candidateName'],
            party: req.body['party']
        },
        returning: true
    })

    //console.log(dbRes);

    //update success
    if (dbRes[0] === 0) {
        res.json({
            status: "error", msg: "Can not find party name"
        });
        return;
    }
    res.json({
        status: "success"
        , msg: "Update Completed"
    });
});

/* DELETE DELETE USELESS CANDIDATE INFORMATION */
router.delete('/', async function (req, res, next) {
    let dbRes = await models.candidate.destroy(
        {
            where: {name: req.query['candidateName'],
            party: req.query['party']},
            returning: true
        })

    //delete success
    //Check if the delete result is 0 or not, 0 show delete success or not
    if (dbRes === 0) {
        res.json({
            status: "error", msg: "Can not find candidate name"
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

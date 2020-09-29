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

/* PATCH UPDATE */
router.patch('/', async function (req, res, next) {
    let newName = req.body['newName'];
    // let dbRes = await models.party.update({partyName: newName}, {
    //     where: {
    //         partyName: req.body['partyName']
    //     }
    // });

   //update success
    //res.send(dbRes);
    // if(dbRes != 0){
    //     res.json({
    //         status: "error", description: "Can not find party name"
    //     });
    //     return;
    // }
    // res.json({
    //     status: "success"
    // });
    let dbRes = await models.party.update({partyName: newName},
    dbRes.connections.update({
        partyName: data.newName,
    }, {
        where: { partyName: req.body['partyName'] },
        returning: true,
        plain: true
    })
        .then(function (result) {
            console.log(result);
        });
});

// db.connections.update({
//     user: data.username,
//     chatroomID: data.chatroomID
// }, {
//     where: { socketID: socket.id },
//     returning: true,
//     plain: true
// })
//     .then(function (result) {
//         console.log(result);
//         // result = [x] or [x, y]
//         // [x] if you're not using Postgres
//         // [x, y] if you are using Postgres
//     });

module.exports = router;

const express = require('express');
const router = express.Router();
const models = require('../models');
const encrypt = require('../utils/encrypt')

/* GET SELECT */
router.get('/:id', async function (req, res, next) {
    let user = await models.user.findByPk(req.params.id);
    res.json({user: user});
});

/* POST ADD */
router.post('/', async function (req, res, next) {
    let user = req.body;

    //check if the driver license, passport and email exist in database
    let count = await models.user.findAndCountAll({
        where: {
            email: req.body['email']
        }
    })
    if(count!=0){
        res.json({status: "error"});
    }

    // encrypt password
    user['password'] = encrypt.encrypt(user['password']);
    res.send(user);

    // insert into database
    try {
        user = await models.user.create(req.body);
    } catch (err) {
        res.json({status: "error"});
    }

    res.json({
        status: "success"
        , id: user['id']
    });
});

/* PATCH UPDATE */
router.patch('/password', async function (req, res, next) {
    await models.user.update({password: encrypt.encrypt(req.body['password'])}, {
        where: {
            id: req.body['id']
        }
    });
});

module.exports = router;

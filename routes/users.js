const express = require('express');
const router = express.Router();
const models = require('../models');
const encrypt = require('../utils/encrypt')

/* GET SELECT */
router.get('/:id', async function (req, res, next) {
    let user = await models.user.findByPk(req.params.id);
    res.json({
        user: {
            id: user['id'],
            name: user['name'],
            birthday: user['birthday'],
            passport: user['passport'],
            driverLicense: user['driverLicense'],
            address: user['address'],
            email: user['email'],
            phoneNumber: user['phoneNumber'],
            createdAt: user['createdAt'],
            updatedAt: user['updatedAt']
        }
    });
});
/* CHECK EMAIL */
router.get('/email/:email', async function (req, res, next) {
    console.log(req);
    let user = await models.user.findAll({
        where: {email: req.params.email}
    });
    if(user.length===0){
        res.json({msg:'can use'});
    }else
        res.json({msg:'already exists'});
});

/* POST ADD */
router.post('/', async function (req, res, next) {
    let user = req.body;
    console.log(req.body);
    // check if the driver license, passport and email exist in database
    // @param {json} [dbRes] response json from database
    let dbRes = await models.user.findAndCountAll({
        where: {
            email: req.body['email']
        }
    });

    // driver license, passport or email already exist in database
    if (dbRes['count'] != 0) {
        res.json({
            status: "error", msg: "driver license, passport or email already exist in database"
        });
        return;
    }

    // encrypt password
    user['password'] = await encrypt.encrypt(user['password']);

    // insert into database
    try {
        user = await models.user.create(req.body);
    } catch (err) {
        console.log(err);
        // failed to insert into database
        // could be database connection error or input not correct
        res.json({status: "error", msg: "input not correct or database connection error"});
        return;
    }

    // insert success
    res.json({
        status: "success"
        , user: {
            id: user['id']
        }
    });

});

/* PUT UPDATE */
router.put('/', async function (req, res, next) {
    await models.user.update({password: await encrypt.encrypt(req.body['password']),address: req.body.address,phoneNumber: req.body.phoneNumber}, {
        where: {
            id: req.body['id']
        }
    });

    // insert success
    res.json({
        status: "success"
        , user: {
            id: user['id']
        }
    });
});

module.exports = router;

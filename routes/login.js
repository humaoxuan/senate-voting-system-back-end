const express = require('express');
const router = express.Router();
const models = require('../models');
const config = require('../config/config.json');
const encrypt = require('../utils/encrypt')

/* GET SELECT */
router.get('/', async function(req, res, next) {

    let user = await models.user.findAll({
        where: {
            email: req.body['email']
        }
    })

    if(encrypt.compare(req.body['password'],user[0]['password'])){
        //Password match
        //Todo login
        res.send('success')
    }else {
        //Password Not match
        //todo return flash
        res.send('wrong password');
    }

});

router.post('/', async function(req, res, next) {
    res.json(req.body);
});

module.exports = router;

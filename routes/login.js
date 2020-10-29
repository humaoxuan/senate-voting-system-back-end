const express = require('express');
const router = express.Router();
const models = require('../models');
const config = require('../config/config.json');
const encrypt = require('../utils/encrypt')

/* GET SELECT */
router.get('/', async function(req, res, next) {


});

router.post('/', async function(req, res, next) {
    console.log(req.body['email']);
    //admin login
    let admin = await models.admin.findAll({
        where: {
            account: req.body['email']
        }
    })

    console.log(req.body['email']);
    if(admin.length!==0){
        if(req.body['password'] === admin[0]['password']){
            res.cookie('id',admin[0].id);
            res.cookie('role',admin[0].role);
            res.json({status:'success'});
            return;
        }
    }

    //user login
    let user = await models.user.findAll({
        where: {
            email: req.body['email']
        }
    })


    if(user.length===0){
        res.json({status:'error',msg:'Email or password not correct!'});
        return;
    }

    if(await encrypt.compare(req.body['password'],user[0]['password'])){
        //Password match
        res.cookie('id',user[0].id);
        res.cookie('role','user');
        res.json({status:'success'});
    }else {
        //Password Not match
        res.json({status:'error',msg:'Email or password not correct!'});
    }

});

module.exports = router;

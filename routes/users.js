const express = require('express');
const router = express.Router();
const models = require('../models');
const encrypt = require('../utils/encrypt')

/* GET SELECT */
router.get('/', async function(req, res, next) {
    let user = await models.user.findByPk(req.body['id']);
    res.json({user: user});
});

/* POST ADD */
router.post('/', async function(req,res,next){
    await models.user.create(req.body);
});

/* PATCH UPDATE */
router.patch('/password', async function (req,res,next){
     await models.user.update({password:encrypt.encrypt(req.body['password'])},{
        where: {
            id: req.body['id']
        }
    });
});






module.exports = router;

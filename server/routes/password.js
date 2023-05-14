const express = require('express');
const router = express.Router({mergeParams: true});
const createError = require('http-errors');

const PasswordService = require('../services/PasswordService');
const PasswordServiceInstance = new PasswordService();
const { validatePasswords } = require('../utils/validators');


 router.put('/password', validatePasswords, async (req, res, next) => {
    try{
        if (!req.isAuthenticated()) { throw createError(401, 'User Not Logged In') }

        const { userid } = req.params;
        const { id } = req.user;
        const data = req.body;
        
        if( id != userid){ throw createError(403, 'Unauthorized Access') }

        const response = await PasswordServiceInstance.update({userid, ...data})

        res.status(200).send(response);
    }catch(err){
        next(err);
    }
 })

 module.exports = router;

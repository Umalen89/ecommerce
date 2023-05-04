const express = require('express');
const router = express.Router({mergeParams: true});
const createError = require('http-errors');
const PInfoService = require('../services/PInfoService');
const { validatePInfo } = require('../utils/validators');

const PInfoServiceInstace = new PInfoService();

 
    router.get('/pinfo', async (req, res, next) => {
        try{
            if (!req.isAuthenticated()) { throw createError(401, 'User Not Logged In') }

            const { userid } = req.params;
            const { id } = req.user

            if( id != userid){ throw createError(403, 'Unauthorized Access') }

            const response = await PInfoServiceInstace.get(userid);

            if(!response){ throw createError(404, 'User info could not be found') }

            res.status(200).send(response);

        }catch(err){
            next(err);
        }
    })

    router.put('/pinfo', validatePInfo,async (req, res, next) => {
        try {
            if (!req.isAuthenticated()) { throw createError(401, 'User Not Logged In') }

            const { userid } = req.params;
            const { id } = req.user;
            const data = req.body;

            if( id != userid){ throw createError(403, 'Unauthorized Access') }

            const response = await PInfoServiceInstace.update({userid, ...data});

            if(!response){ throw createError(404, 'User info could not be found') }

            res.status(200).send(response);
        }catch(err){
            next(err);
        }
    });

module.exports = router;
const express = require('express');
const createError = require('http-errors');
const router = express.Router({mergeParams: true});
const { validateAddress } = require('../utils/validators');

const AddressService = require('../services/AddressService');
const AddressServiceInstance = new AddressService();

 router.get('/addresses', async (req,res, next) => {
    try{
        if (!req.isAuthenticated()) { throw createError(401, 'User Not Logged In') }

        const { userid } = req.params;
        const { id } = req.user
    
        if( id != userid){ throw createError(403, 'Unauthorized Access') }

        const response = await AddressServiceInstance.getAll(userid);
        
        if(!response){ throw createError(404, 'Content not found') }

        res.status(200).send(response);

    }catch(err){
        next(err);
    }
 });

 router.get('/addresses/:addressid', async(req,res, next) => {
    try{
        if (!req.isAuthenticated()) { throw createError(401, 'User Not Logged In') }

        const { userid, addressid } = req.params;
        const { id } = req.user
    
        if( id != userid){ throw createError(403, 'Unauthorized Access') }

        const response = await AddressServiceInstance.getSingle({userid, addressid});
        
        if(!response){ throw createError(404, 'Content not found') }

        res.status(200).send(response);

    }catch(err){
        next(err);
    }
 });

 router.post('/addresses', validateAddress, async (req, res, next) => {
    try{
        if (!req.isAuthenticated()) { throw createError(401, 'User Not Logged In') }

        const { userid } = req.params;
        const { id } = req.user;
        const data = req.body;
    
        if( id != userid){ throw createError(403, 'Unauthorized Access') }
        
        const response = await AddressServiceInstance.create({userid, ...data});

        res.status(200).send(response);
    }catch(err){
        next(err);
    }
 });


 router.delete('/addresses/:addressid', async(req,res, next) => {
    try{
        if (!req.isAuthenticated()) { throw createError(401, 'User Not Logged In') }

        const { userid, addressid } = req.params;
        const { id } = req.user;
        
    
        if( id != userid){ throw createError(403, 'Unauthorized Access') }

        const response = await AddressServiceInstance.delete({userid, addressid})
        
        res.status(200).send(response);
    }catch(error){
        next(error);
    }
 });

 module.exports = router;
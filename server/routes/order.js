const express = require('express');
const router = express.Router({mergeParams: true});
const createError = require('http-errors');

const OrderService = require('../services/OrderService');
const OrderServiceInstance = new OrderService();

router.get('/orders', async (req, res, next) => {
    try{
        if (!req.isAuthenticated()) { throw createError(401, 'User Not Logged In') }

        const { userid } = req.params;
        const { id } = req.user
    
        if( id != userid){ throw createError(403, 'Unauthorized Access') }

        const response = await OrderServiceInstance.getAll(userid);
        
        if(!response){ throw createError(404, 'Content not found') }

        res.status(200).send(response);
    }catch(err){
        next(err)
    }
})

router.get('/orders/:orderid',async (req, res, next) => {
    try{
        if (!req.isAuthenticated()) { throw createError(401, 'User Not Logged In') }

        const { userid, orderid } = req.params;
        const { id } = req.user
    
        if( id != userid){ throw createError(403, 'Unauthorized Access') }

        const response = await OrderServiceInstance.getSingle({userid, id: orderid});
        
        if(!response){ throw createError(404, 'Content not found') }

        res.status(200).send(response);
    }catch(err){
        next(err);
    }
})

router.put('/orders/:orderid', async (req, res, next) => {
    try{
        if (!req.isAuthenticated()) { throw createError(401, 'User Not Logged In') }

        const { userid, orderid } = req.params;
        const { id } = req.user;
        const { status } = req.body;
    
        if( id != userid){ throw createError(403, 'Unauthorized Access') }

        const response = await OrderServiceInstance.update({id: orderid, status});

        res.status(200).send(response);
    }catch(err){
        next(err);
    }
})

module.exports = router;
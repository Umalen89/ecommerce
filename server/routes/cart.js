const express = require('express');
const router = express.Router({mergeParams: true});
const createError = require('http-errors');
const { validateCheckout } = require('../utils/validators')

const CartService = require('../services/CartService');
const CartServiceInstance = new CartService();


router.get('/cart', async (req, res, next) => {
    try{
        if (!req.isAuthenticated() ) { throw createError(401, 'User Not Logged In') }  

        const { userid } = req.params;
        const { id } = req.user

        if ( id != userid){ throw createError(403, 'Unauthorized Access') }

        const results = await CartServiceInstance.getCart(userid);

        res.status(200).send(results);
    }catch(err){
        next(err);
    }
});

router.get('/cart/products', async(req, res, next) => {
    try{
        
        if (!req.isAuthenticated() ) { throw createError(401, 'User Not Logged In') }  
        
        const { userid } = req.params;
        const { id } = req.user

        if ( id != userid){ throw createError(403, 'Unauthorized Access') }
        
        const results = await CartServiceInstance.getProducts(userid);

        res.status(200).send(results);

    }catch(err){
        next(err);
    }
})

router.post('/cart/products', async (req, res, next) => {
    try{
        if (!req.isAuthenticated() ) { throw createError(401, 'User Not Logged In') }  
        
        const { userid } = req.params;
        const { id } = req.user;
        const data = req.body;

        if ( id != userid){ throw createError(403, 'Unauthorized Access') }

        const results = await CartServiceInstance.addProduct({cart_userid: userid, ...data})

        res.status(200).send(results);
    }catch(err){
        next(err);
    }
})

router.delete('/cart/products', async (req, res, next) => {
    try{
        if (!req.isAuthenticated() ) { throw createError(401, 'User Not Logged In') }  
        
        const { userid } = req.params;
        const { id } = req.user;
        
        if ( id != userid){ throw createError(403, 'Unauthorized Access') }

        const results = await CartServiceInstance.deleteAllProducts(userid)

        res.status(200).send(results);
    }catch(err){
        next(err);
    }
})

router.delete('/cart/products/:productid', async (req, res, next) => {
    try{
        if (!req.isAuthenticated() ) { throw createError(401, 'User Not Logged In') }  
        
        const { userid, productid } = req.params;
        const { id } = req.user;
        
        if ( id != userid){ throw createError(403, 'Unauthorized Access') }

        const results = await CartServiceInstance.deleteProduct({cart_userid: userid, id: productid})

        res.status(200).send(results);
    }catch(err){
        next(err);
    }
})



router.post('/cart/checkout', validateCheckout, async (req, res, next) => {
    try{
        if (!req.isAuthenticated() ) { throw createError(401, 'User Not Logged In') }  
        
        const { userid } = req.params;
        const { id } = req.user;
        const data = req.body;

        if ( id != userid){ throw createError(403, 'Unauthorized Access') }

        const results = await CartServiceInstance.checkout({cart_userid: userid, ...data})

        res.status(200).send(results);
    }catch(err){
        next(err);
    }
})

module.exports = router;
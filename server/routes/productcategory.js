const express = require('express');
const router = express.Router();

const ProductCategoryService = require('../services/ProdCatService');
const ProdCatServiceInstance = new ProductCategoryService();

module.exports = (app) => {

    app.use('/api/categories', router);

    router.get('/', async (req,res, next) => {
        try{
            const results = await ProdCatServiceInstance.getCategories();
            
            res.status(200).send(results);
        }catch(err){
            next(err);
        }
    })

    router.get('/search', async (req, res, next) => {
        try{

            const searchquery = req.query.query;

            const results = await ProdCatServiceInstance.searchProducts(searchquery);

            res.status(200).send(results);
        }catch(err){
            next(err);
        }
    })

    
    router.get('/products', async (req, res, next) => {
        try{
            const results = await ProdCatServiceInstance.getAll();

            res.status(200).send(results);
        }catch(err){
            next(err);
        }
    })

    router.get('/:categoryid', async (req, res, next) => {
        try{
            const { categoryid } = req.params;

            const results = await ProdCatServiceInstance.getCategoryProducts(categoryid);

            res.status(200).send(results);
        }catch(err){
            next(err);
        }
    })


    router.get('/products/:productid', async (req, res, next) => {
        try{
            const { productid } = req.params;

            const results = await ProdCatServiceInstance.getProduct(productid);

            res.status(200).send(results);
        }catch(err){
            next(err);
        }
    })

}
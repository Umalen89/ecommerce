const createError = require('http-errors');

const ProductCategoryModel = require('../models/productcategory');
const ProductCategoryInstance = new ProductCategoryModel();

module.exports = class ProductCategoryService {
    async getCategories(){
        try{
            const results = await ProductCategoryInstance.getCategories();
            
            return results;
        }catch(error){
            throw createError(500, err);
        }
    }

    async getCategoryProducts(categoryid){
        try{
            const results = await ProductCategoryInstance.getProductsOfCategory(categoryid);

            if (!results) { throw createError(404, 'Content Not Found')}

            return results;
        }catch(err){
            throw createError(500, err);
        }
    }

    async getProduct(productid){
        try{
            const results = await ProductCategoryInstance.getProduct(productid);

            if (!results) { throw createError(404, 'Content Not Found')}

            return results;
        }catch(err){
            throw createError(500, err);
        }
    }

    async searchProducts(searchquery){
        try{
            const results = await ProductCategoryInstance.searchProducts(searchquery);

            if (!results) { throw createError(404, 'Content Not Found')}

            return results;
        }catch(err){
            throw createError(500, err)
        }
    }

    async getAll(){
        try{
            const results = await ProductCategoryInstance.getAll();

            if (!results) { throw createError(404, 'Content Not Found')}

            return results;
        }catch(err){
            throw createError(500, err)
        }
    }
}
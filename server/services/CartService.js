const createError = require('http-errors');

const CartModel = require('../models/cart');
const CartInstance = new CartModel();
const CartProductModel = require('../models/cartproduct');
const CartProductInstance = new CartProductModel();
const TransactionModel = require('../models/transaction');
const TransactionInstance = new TransactionModel();

module.exports = class CartService {
    async getCart(userid){
        try{
            const results = await CartInstance.get(userid);

            if(!results) { throw createError(404, 'Content Not Found')}

            return results;
        }catch(err){
            throw createError(500, err);
        }
    }

    async getProducts(userid){
        try{
            const results = await CartProductInstance.getAll(null, userid);

            if(!results) { throw createError(404, 'Content Not Found')}

            return results;
        }catch(err){
            throw createError(500, err);
        }
    }

    async addProduct(data){
        try{
            const results = await TransactionInstance.addProductToCart(data);

            if(!results) { throw createError(500, 'Something went wrong')};

            return results;
        }catch(err){
            throw createError(500, err);
        }
    }

    async deleteProduct(data){
        try{

            const results = await TransactionInstance.deleteProductFromCart(data);

            if(!results) { throw createError(500, 'Something went wrong')};

            return results;
        }catch(err){
            throw createError(500, err);
        }
    }

    async deleteAllProducts(userid){
        try{

            const results = await TransactionInstance.deleteAllFromCart(userid);

            if(!results) { throw createError(500, 'Something went wrong')};

            return results;
        }catch(err){
            throw createError(500, err);
        }
    }

    async checkout(data){
        try{
            
            const results = await TransactionInstance.checkout(data)

            return results;
        }catch(error){
            throw createError(500, err);
        }
    }

}
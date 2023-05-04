const createError = require('http-errors');

const OrderModel = require('../models/order');
const OrderInstance = new OrderModel();
const OrderProductModel = require('../models/orderproduct');
const OrderProductInstance = new OrderProductModel();


module.exports = class OrderService {
    async getAll(userid){
        try{
            const results = await OrderInstance.getAll(userid)

            return results;
        }catch(err){
            throw createError(500, err)
        }        
    }

    async getSingle(data){
        try{
            const results1 =  await OrderInstance.getSingle(data);

            if(results1 === null){ return null };
            
            const results2 = await OrderProductInstance.get(data.id);
    
            return ({order: results1, products: results2});
        }catch(err){
            throw createError(500, err)
        }        
    }

    async update(data){
        try{
            const results = await OrderInstance.update(data);

            return results;
        }catch(err){
            throw createError(500, err)
        }        
    }
}

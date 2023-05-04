const createError = require('http-errors');


const AddressModel = require('../models/address');
const AddressInstance = new AddressModel();

module.exports = class AddressService {
    async getAll(userid){
        try{
            
            const results = await AddressInstance.getAll(userid);
            
            return results;
        }catch(err){
            throw createError(500, err);
        }
    }

    async getSingle(data){
        try{
            
            const results = await AddressInstance.getSingle(data);
            
            return results;
        }catch(err){
            throw createError(500, err);
        }
    }

    async create(data){
        try{
            const check = await AddressInstance.checkIfExists(data);
            if (check) {
                throw createError(409, 'Address already exists for User');
            }
            
            const results = await AddressInstance.create(data);

            return results;
        }catch(err){
            throw createError(500, err);
        }
    }

    async delete(data){
        try{
            const check = await AddressInstance.getSingle(data);

            if(!check){ throw createError(404, 'Address Not Found')}

            const results = await AddressInstance.delete(data);

            return results;
        }catch(error){
            throw createError(500, error);
        }
    }
}
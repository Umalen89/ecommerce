const createError = require('http-errors');
const PInfoModel = require('../models/userpinfo');


const PInfoInstance = new PInfoModel();

module.exports = class PInfoService {

    async get(userid) {
        try{
            const userInfo = await PInfoInstance.get(userid);

            if (!userInfo) { return null }
    
            return userInfo;
        }catch(err){
            throw createError(500, err)
        }
    }

    async update(data){
        try{
            const userInfo = await PInfoInstance.update(data);

            return userInfo;
        }catch(error){
            throw createError(500, err)
        }
    }
}
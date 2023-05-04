const createError = require('http-errors');
const bcrypt = require('bcrypt');

const PasswordModel = require('../models/userpswd');
const PasswordInstance = new PasswordModel();

module.exports = class PasswordService {

    async update(data) {
        try{
            
            const { newpassword, oldpassword , userid } = data;

            const dbpassword = await PasswordInstance.get(userid);
            
            const matchedPassword = await bcrypt.compare(oldpassword, dbpassword.password);

            if (!matchedPassword) {
                throw createError(401, 'Incorrect password');
            }

            // Salt For new password
            const salt = await bcrypt.genSalt(10);
            // Hash password
            const hashedPassword = await bcrypt.hash(newpassword, salt);
            data.password = hashedPassword;

            const result = await PasswordInstance.update({userid, password: hashedPassword})

            return result;
        }catch(err){
            throw createError(500, err);
        }
        
    }
}
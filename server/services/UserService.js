const createError = require('http-errors');

const UserModel = require('../models/user');
const UserModelInstance = new UserModel();

module.exports = class UserService {

  async get(id) {
    try {

      const user = await UserModelInstance.findById(id);

      return user;

    } catch(err) {
        throw createError(500, err);
    }

  };

  async update(data) {
    try {
      const { email, username, id } = data;

      const checkemail = await UserModelInstance.findByEmail(email);
      const checkusername = await UserModelInstance.findByUsername(username);

      // If user already exists, reject
      if (checkemail) {
        if (checkemail.id != id){
          throw createError(409, 'Email already in use');
        }
      }
      if (checkusername) {
        if (checkusername.id != id){
          throw createError(409, 'Username already in use');
        }
      }

      const results = await UserModelInstance.update(data);

      return results;

    } catch(err) {
        throw createError(500, err);
    }

  };

}
const createError = require('http-errors');
const bcrypt = require('bcrypt');

const TransactionModel = require('../models/transaction');
const TransactionModelInstance = new TransactionModel();
const UserModel = require('../models/user');
const UserModelInstance = new UserModel();


module.exports = class AuthService {

  async register(data) {
     try {
     
     const { email, username } = data.user;
   
      // Check if user already exists
      const checkemail = await UserModelInstance.findByEmail(email);
      const checkusername = await UserModelInstance.findByUsername(username);

      // If user already exists, reject
      if (checkemail) {
        throw createError(409, 'Email already in use');
      }
      if (checkusername) {
        throw createError(409, 'Username already in use');
      }

      const password = data.password;

      // generate salt for password
      const salt = await bcrypt.genSalt(10);
      // Hash password
      const hashedPassword = await bcrypt.hash(password, salt);
      data.password = hashedPassword;
      
      // User doesn't exist, create new user record
      return await TransactionModelInstance.createUser(data.user, data.password, data.pinfo);

    } catch(err) {
      throw createError(500, err);
    }

  };

  async login(data) {

    const { email, lpassword } = data;

    try {
      // Check if user exists
      const user = await UserModelInstance.findByEmail(email);

      // If no user found, reject
      if (!user) {
        throw createError(401, 'Incorrect email');
      }
      
      // Check for matching passwords
      const matchedPassword = await bcrypt.compare(lpassword, user.password);

      if (!matchedPassword) {
        throw createError(401, 'Incorrect password');
      }

      return ({id: user.id, username: user.username, email: user.email});

    } catch(err) {
      throw createError(500, err);
    }

  };

}
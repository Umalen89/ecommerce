const express = require('express');
const createError = require('http-errors');
const router = express.Router();
const UserService = require('../services/UserService');
const { validateUsernameEmail } = require('../utils/validators')

const UserServiceInstance = new UserService();
const pinfoRouter = require('./pinfo');
const passwordRouter = require('./password');
const addressRouter = require('./address');
const cartRouter = require('./cart');
const ordersRouter = require('./order');

module.exports = (app) => {

  app.use('/users', router);


  router.get('/:userid', async (req, res, next) => {

    try {
        if (!req.isAuthenticated()) { throw createError(401, 'User Not Logged In') }

        const { userid } = req.params;
        const { id } = req.user

        if( id !== parseInt(userid)){ throw createError(403, 'Unauthorized Access') }
      
        const response = await UserServiceInstance.get(userid);
        if(!response){ throw createError(404, 'User record could not be found') }

        res.status(200).send(response);
    } catch(err) {
      next(err);
    }
  });

  router.put('/:userid', validateUsernameEmail, async (req, res, next) => {
    try {
      if (!req.isAuthenticated() ) { throw createError(401, 'User Not Logged In') }  

      const { userid } = req.params;
      const { id } = req.user

      if ( id != userid){ throw createError(403, 'Unauthorized Access') }

      const data = req.body;

      const response = await UserServiceInstance.update({ id: userid, ...data });

      res.status(200).send(response);
    } catch(err) {
      next(err);
    }
  });

  app.use('/users/:userid', pinfoRouter);
  app.use('/users/:userid', passwordRouter);
  app.use('/users/:userid', addressRouter);
  app.use('/users/:userid', cartRouter);
  app.use('/users/:userid', ordersRouter);
}
const express = require('express');
const router = express.Router();
const { validateSignup, validateLogin } = require('../utils/validators');

// Instantiate Services
const AuthService = require('../services/AuthService');
const AuthServiceInstance = new AuthService();

module.exports = (app, passport) => {

  app.use('/auth', router);

  // Registration Endpoint
  router.post('/register',validateSignup, async (req, res, next) => {
  
    try {
      const data = req.body;
      
      const response = await AuthServiceInstance.register(data);
      
      res.status(200).send(response);
    } catch(err) {
      next(err);
    }
  
  });
  
  // Login Endpoint
  router.post('/login', validateLogin, passport.authenticate('local'), async (req, res, next) => { 
    try{   
      res.status(200).send(req.user);
    } catch(err){
        next(err);
    }
  });

  router.get('/logout', (req, res) => {
    if(req.isAuthenticated()){
      req.session.destroy(err => {
        if (err) {
          console.log(err);
        } else {
          res.clearCookie('connect.sid');
          res.status(200).json({Message: 'OK'});
        }
      });
    } else {
      res.status(404).send('Cant logout without login');
    }
  });
  
}
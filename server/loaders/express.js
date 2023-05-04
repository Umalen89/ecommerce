const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
require("dotenv").config({ path: '../config.env' });
const pool = require('../dbconfig')
const pgSession = require('connect-pg-simple')(session);

module.exports = (app) => {

  // Enable Cross Origin Resource Sharing to all origins by default
  app.use(cors());

  // Transforms raw string of req.body into JSON
  app.use(bodyParser.json());

  // Parses urlencoded bodies
  app.use(bodyParser.urlencoded({ extended: true }));

  // 
  app.set('trust proxy', 1);

  // Creates a session
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: new pgSession({
        pool,
        tableName: 'session'
      }),
      cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
      }
    })
  );

  return app;
  
}

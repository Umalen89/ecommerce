const express = require('express');
const app = express();
require("dotenv").config({ path: './config.env' });

const loaders = require('./loaders');

async function startServer() {

  // Init application loaders
  loaders(app);

  // Start server
  app.listen(process.env.PORT, () => {
    console.log(`Server listening on PORT ${process.env.PORT}`);
  })
}

startServer();
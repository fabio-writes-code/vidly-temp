const express = require('express');
// const winston = require('winston/lib/winston/config');
const app = express();
const logger = require('./startup/logger');

require('./startup/logger');
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config');
require('./startup/validation')();
require('./startup/prod')(app) //* Additional code can be added to check that env is prod

// *This code block contained all user defined modules. Moved to ./startup/routes.js
// const genres=require('./routes/genres'), etc...

// *This code block contained config for jwtPrivateKey. Moved to startup/config
// if(!config.get('jwtPrivateKey')){ //*1

// *This code block contained MongoDB conection, moved to ./startup/DB
// mongoose.connect('mongodb://localhost/movie-genres')

// *This code block contains all route syntaxis (app.use). Moved to ./startup/routes.js
// app.use(express.json()), etc...

// PORT and Environment Variables
const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
    logger.info(`Listening to port ${port}...`)
); //*1

module.exports = server;

// ****----****
// *1-app.listen() retunrs a server object. Storing it in a variable and exporting it to add further configurations

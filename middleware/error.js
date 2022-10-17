// const logger=require('../startup/logger')
// const winston=require('winston')
const logger=require('../startup/logger')

module.exports = function(err,req,res,next){
    // winston.log('error', err.message) //*2
    logger.error(err.message, err) //*3
    res.status(500).send('Someting failed') //*1
    
}

// *1-Error middelware function message. It returns the status and the attached message to the client

// *2-Logging errors with winston (npm i winston)
// *2.1-winston.log(param1, param2) where param1 is logging level and param2 the error message
// *2.1.1-Types of logging leves: error (for errors, most important), warn (warning), info(for storing info about the app), verbose, debug, silly.

// *3-Alternate syntaxis for logging with winston. param:err logs all the metadata of the error
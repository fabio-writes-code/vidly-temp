const winston=require('winston')
require('winston-mongodb')
require('express-async-errors') //*3
const config=require('config')

// const mongoTransport=winston.add(new winston.transports.MongoDB({
//     db:config.get('db'),
//     level:'error',
//     options: {useUnifiedTopology:true}
// }))

const logger=winston.createLogger({ //*4
        level:'info', //*7
        format:winston.format.json(),
        transports: [
            new winston.transports.File({filename:'logfile.log', level:'info'}),
            new winston.transports.Console({ colorize:true, prettyPrint:true }),
            // mongoTransport //*6
        ],
        exceptionHandlers:[
            new winston.transports.File({filename:'exception.log'}),  //*9
            new winston.transports.Console({ colorize:true, prettyPrint:true })
        ],
        rejectionHandlers:[
            new winston.transports.File({filename:'rejection.log'}),
            new winston.transports.Console({colorize:true,prettyPrint:true})
        ]
    })
module.exports=logger

// process.on('uncaughtException', (ex)=>{ // *8
//     console.log('Uncaught Exception')
//     process.exit(1)
// })

// process.on('unhandledRejection',(ex)=>{
//     console.log('Uncaught Promise Rejection')
//     process.exit(1)
// })

// throw new Error('Something failed at startup') //* Creating errors
// const p= Promise.reject(new Error('Promise failed'))
// p.then(()=>console.log('Done')) 


// *3-Passes control of error handling from the router function (i.e: router.get()) to the error handling function. 'Monkey patches' the router functions so that middleware/async.js wraps its execution for error handling.

// *4-Create a new logger. Define level and create a new transport for it
// *4.1-Transport: Included in the logger object, is basically a storage device for the logs. Winston comes with transports for console, file and http. Thrid party plug-in to log msges in MongoDB, couchDb and so on.

// *6-Logging errors to MongoDB: In real world apps you want to separate log databases from operational database.
// *6.1-Winston will add the log to the n<ew transport automatically

// *7-Winston info levels are: error, warn, info, verbose, debug, silly. If a transport is defined with level info, it will log all messages with level info and above: error, warn

// *8-Winston only logs errors when express is already running, request erros and the like. A different approach is required to log errors at startup, for example when connecting to the database.
// *8.1-For this we need an event emitter, such as process.on()
// *8.2-Approach does not work with promises, only with sync code

// *9-Definning a new transport for uncaught exceptions and promise rejections. Winston handler is preferred by Mosh

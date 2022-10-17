const config=require('config')
const logger=require('./logger')

module.exports=function(){
    if(!config.get('jwtPrivateKey')){ //*1
        throw new Error('FATAL ERROR: jwtPrivateKey is not defined.') //*3
        // process.exit(1) //*2
    }
}

// ****----****
// *1-Config module must be imported and jwtPrivateKey inside it must be verified before the app can start, otherwise authentication is compromised.
// *1.1-Environment variable defined with cmd set vidly_jwtPrivateKey. In this case mySecureKey

// *2-process is a global object in nodejs. In process.exit(), 0 is success, anything else means failure

// *3-No need for process exit, since winston logger exceptionHandler will terminate the process by itself
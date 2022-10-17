// TODO: Starting all database related processes
const mongoose=require('mongoose')
const logger=require('./logger')
const config=require('config')


module.exports=function(){
    const db=config.get('db')
    mongoose.connect(db) //*2
        .then(()=>logger.log('info', `Connected to ${db} Database....`)) // *This messages are better logged into winston
}

// *1-Since winston is handling exceptions the catch method is removed.
// *2-The connection string retrieves the db variable from the config files, depending of the environment
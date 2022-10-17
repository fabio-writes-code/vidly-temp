// TODO Authentication methods. usually named auth

const express=require('express')
const router=express.Router()
const mongoose=require('mongoose');
const {User}=require('../models/users');
const _=require('lodash')
const bcrypt=require('bcrypt')
const Joi=require('joi')
const jwt=require('jsonwebtoken')
const config=require('config')


// GET
router.get('/',(req,res)=>{
    const p = new Promise((resolve,reject)=>{
        const user=User
            .find()
            .select();
        resolve(user)
    })
    p.then(resolve=>res.send(resolve))
})

router.get('/:id', async (req,res)=>{
    const user=await User.findById(req.params.id)
    !user? res.status(404).send('User does not exist'):res.send(user)
})

// POST
router.post('/', async (req,res)=>{
    const { error } =validate(req.body) //*Validate function is part of the route module
    if (error) return res.status(400).send(error.details[0].message)

    // *Validate the email and look for user in the database
    let user = await User.findOne({email:req.body.email})
    if (!user) return res.status(400).send('Invalid user or password')

    // *validating password with bcrypt //*1
    const validPassword=await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) return res.status(400).send('Invalid user or password')

    // *2 
    // const token=jwt.sign({ //*3
    //     _id:user._id
    // },config.get('jwtPrivateKey')) //*4

    const token=user.generateAuthToken(); //*5
    res.send(token)

    // res.send(token)
})

//*6

function validate(req){
    const schema=Joi.object({
        email:Joi.string().min(3).max(255).required().email(),
        password:Joi.string().min(3).max(255).required()
    })
    return schema.validate(req) 
}

module.exports=router;

// ****----****
// *1-bcrypt includes a method to compare the client's password with the retrieved one from the database and return a boolean if they match. The method includes the salt

// *2-JSON webtoken: long string that identifies a user, like an ID or password. Upon login server send client the webtoken, the client will the use the webtoken for future API calls.
// *2.1-Client stored the webtoke. For webapps, it is stored in the browser's local storage. Mobile app has a similar solution (jwt.io)
// *2.3-JSON webtokens have general structure of 'string'.'string'.'string'. Where each one of the strings can be decoded header, payload and digital signature, respectively.
// *2.3.1-Header: has general info on the webtoken algorithm and type.
// *2.3.2-Payload: stores public info on the user, such as userId, name and adming:boolean. Allows for retrieving info like admin privileges without querying the database. Includes 'iat' property, storing the 'age' of the jwt.
// *2.3.3-Verify Signature: Created based on the info of the JSON webtoken and a server's private key. It allows for user's to have their own ID, without risking user manipulation. If a user attempts to change info inside its public properties, the digital signature will become invalid.
// *2.4-npm i JSON webtoken

// *3-JSON webtoken implementation with jwt.sing(). Param1: Definition of payload the server returns to the user. Param2: the server's digital signature.
// *3.1-Private key is stored in the environment variable config file. Retrieved using config.get() method from confid module
// *3.2-set

// *4-Using the config module to store jwt's digital signature.

// *5-Previous implementation to generate AuthToken is not scalable. Is preferable to define authToken inside user model.

// *6-As best practice logout should take place in frontend. JSON web token is not being stored in the server, but in the client's side of the app. Therefore is better to implement a way to delete the token once the user is logged out.
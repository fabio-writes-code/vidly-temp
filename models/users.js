const mongoose=require('mongoose')
const Joi=require('joi');
const jwt=require('jsonwebtoken')
const config =require('config')
const { date } = require('joi');

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:3,
        maxlength: 250
    },
    email:{
        type:String,
        required:true,
        unique:true,
        minlength:3,
        maxlength: 255 
    },
    password:{
        type:String,
        required:true,
        minlength:3,
        maxlength:1024
    },
    isAdmin:Boolean //*3
})

userSchema.methods.generateAuthToken=function(){ //*1
    const token=jwt.sign({_id:this._id,isAdmin:this.isAdmin},config.get('jwtPrivateKey')) //*2
    return token
}

const User=mongoose.model('User',userSchema)

function validate(user){
    const schema=Joi.object({
        name:Joi.string().min(3).max(250).required(),
        email:Joi.string().min(3).max(255).required().email(), //*email() checks that the email is valid
        password:Joi.string().min(3).max(255).required() //*1
    })
    return schema.validate(user) 
}

exports.User=User;
exports.validate=validate;

// ****----****
// *Authentication: Identifying if the user is who they say they are. Login and so on
// *Authorization and levels of authorization: Check if the user has the level of persmission of a user to perform an action
// *To require more precise password requirements, you can import and use joi-password-complexity. Let's you configure the complexity of the password you want to have.

// *1-Information Expert Priciple -> Creating a function to generate an Auth token. Stored in models/users.js since it has the most info related to the token.
// *1.1- mongoose.schema.methods to name and store a new method or function what will be attached to the schema and later the User object itself

// *2-Returning the id of the user, using this since it refers to the obejct itself. Because of this arrow functions cannot be used in the syntaxis

// *3-To add role based authorization the boolean type isAdmin needs to be contained and verified within the json webtoken. If more roles need to be added a better approach could be to include an array with the roles a user has and link those roles with their functionality, or an array of operations that holds all the operations a user can perform.
// *3.1-For either approach middleware function admin.js should be modified accordingly
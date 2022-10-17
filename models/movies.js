const mongoose=require('mongoose')
const Joi=require('joi')
const {genreSchema}=require('./genres');
const { boolean } = require('joi');

// const genreSchema= new mongoose.Schema({ //*Brought from /models/genres
//     name:String
// })

const movieSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
        minlength:3,
        maxlength:255
    },
    genre:{
        type:genreSchema,
        required:true
    },
    numberInStock:{
        type:Number,
        required:true,
        min:0, //*avoid negative numbers
        max:255 //*avoid numbers that could break the app
    },
    dailyRentalRate:{
        type:Number,
        required:true,
        min:0,
        max:255
    }
})

const Movie=mongoose.model('Movies',movieSchema);

// Validate Input
function validate(genre){
    const schema=Joi.object({
        title:Joi.string().min(3).max(255).required(),
        numberInStock:Joi.number().min(0).max(255).required(),
        dailyRentalRate:Joi.number().min(0).max(255).required(),
        genreId:Joi.objectId().required() //*1
    })
    return schema.validate(genre) 
}

exports.Movie=Movie;
exports.movieSchema=movieSchema;
exports.validate=validate;

// ****----****
// *1-Joi schema validation and the mongoose schema validation can be different. One check the Id given by client, the other checks the internal persistance model

const mongoose=require('mongoose')
const Joi=require('joi')

const genreSchema= new mongoose.Schema({ //*Define schema separatedly to embed it in movies
    name:{
        type:String,
        required:true,
        minlength:5,
        maxlength:50
    }
})

const Genre=mongoose.model('Genre',genreSchema);

// Validate Input
function validateGenre(genre){
    const schema=Joi.object({
        name:Joi.string().min(5).max(50).required()
    })
    return schema.validate(genre) 
}

exports.genreSchema=genreSchema;
exports.Genre=Genre;
exports.validate=validateGenre;

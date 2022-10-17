const mongoose=require('mongoose')
const Joi=require('joi')

// *Holds all the code for defining and validating the customer

const customerSchema=new mongoose.Schema({
    isGold:{
        type:Boolean,
        required:true,
        default:false
    },
    name:{
        type:String,
        required:true,
        minlength:3,
        maxlength:50
    },
    phone:{
        type:String,
        required:true,
        minlength:9,
        maxlength:10
    }
    
})

const Customer=mongoose.model('Customer',customerSchema);

function validateData(customer){
    const schema=Joi.object({
        name:Joi.string().min(5).max(50).required(),
        isGold:Joi.boolean().required(),
        phone:Joi.string().min(5).max(50).required()
    })
    return schema.validate(customer) 
}

module.exports.Customer=Customer; //*Module can be included or not, makes no difference
exports.validate=validateData;
exports.customerSchema=customerSchema;
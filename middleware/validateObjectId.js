const mongoose=require('mongoose')

module.exports =function(req,res,next){
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(404).send('Invalid Id') //*1
    next()
}

// *1-Validating Id. Whereas for Id's provided in the body of the requests we can use Joi-ObjectId validation. For Id's passed as part of the requests we check using mongoose.Types.ObjectId.isValid()
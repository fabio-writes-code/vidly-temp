const mongoose = require('mongoose');
const Joi = require('joi');
const { date } = require('joi');
const moment=require('moment')
// Joi.objectId=require('joi-objectid')(Joi) //*4

const rentalSchema = new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            //*1
            name: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50,
            },
            isGold: {
                type: Boolean,
                required: true,
            },
            phone: {
                type: String,
                required: true,
                minlength: 8,
                maxlength: 10,
            },
        }),
        required: true,
    },
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true,
                trim: true,
                minlength: 3,
                maxlength: 255,
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0,
                max: 255,
            },
        }),
        required: true,
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now,
    },
    dayReturned: {
        type: Date, //* Not required
    },
    rentalFee: {
        type: Number,
        min: 0,
    },
});

// *Adding a static method to look and return a rental object
rentalSchema.statics.lookUp = function (customerId, movieId) { //*5
    return this.findOne({ //*6
        'customer._id': customerId,
        'movie._id': movieId,
    });
};


// *Creating an instance method for rental fee processing. //*7
rentalSchema.methods.returnProcessing = function(){
    this.dayReturned = new Date();

    const rentalDays = moment().diff(this.dateOut, 'days');
    this.rentalFee = rentalDays * this.movie.dailyRentalRate;
}

const Rental = mongoose.model('Rental', rentalSchema);

// Validate Input //*3
function validate(rental) {
    //*2
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required(),
    });
    return schema.validate(rental);
}

exports.Rental = Rental;
exports.validate = validate;
exports.lookUp = this.lookUp;

// ****----****
// *1-New customer schema type, the full customer schema can have numerous properties and not all of them need to be stored in every rental document.

// *2-client only inputs the customer Id and the client's id. Means that though the rental mongoose.schema object has several properties, almost all of them will be retrieved from customer and movie databases.

// *3-Validating objectId's with joi requires module joi-objectid

// *4-require('joi-objectid') returns a function. To that function, previous module Joi, is passed as a parameter. This returns mehtod we choose to call Joi.objectId()
// *4.1-same as const joiObject=require('joi-objectid'); joiObject(Joi)
// *4.2-Implementation moved to index.js for eficiency

// *5- Objects in Js have to types of methods, static and instance:
// *5.1- Static: Methods that belong to the class itself, such as Rental.lookUp(). When not working with a particular object
// *5.2- Instance: Methods that belong to objects insanciated from the class, new Rental().generateRental(). Insntace methods pertain to the information inside the instanciated object

// *6- The function will return a promise, the external function will have to await for. Because syntaxis uses 'this' arrow functions are not allowed

// *7- Instance method isntead of static method since it pertains to information enclosed in the instaciated object.
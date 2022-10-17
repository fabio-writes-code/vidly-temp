const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Rental, validate } = require('../models/rentals');
const moment = require('moment');
const { Movie } = require('../models/movies');
const validator = require('../middleware/validator');

// router.get('/', (req, res) => {});

// router.get('/:id', validateObjectId, async (req, res, next) => {});

// POST

//*5
router.post('/', [auth, validator(validate)], async (req, res) => {
    //*3
    // if (!req.body.movieId) return res.status(400).send('MovieId not provided');
    // if (!req.body.customerId) return res.status(400).send('CustomerId not provided');

    //*4
    // const { error } = validate(req.body);
    // if (error) return res.status(400).send(error.details[0].message);

    // *6
    // const rental = await Rental.findOne({
    //     'customer._id': req.body.customerId, //*1
    //     'movie._id': req.body.movieId,
    // });
    const rental =await Rental.lookUp(req.body.customerId, req.body.movieId)

    if (!rental) return res.status(404).send('No record for customer and movie');
    if (rental.dayReturned) return res.status(400).send('Rental has been previously processed');

    // *7
    // rental.dayReturned = new Date();
    // const rentalDays = moment().diff(rental.dateOut, 'days'); //*2
    // rental.rentalFee = rentalDays * rental.movie.dailyRentalRate;
    rental.returnProcessing();
    await rental.save();

    // *8
    // const movie = await Movie.findById(rental.movie._id); //* Increasing movie stock upon return post
    // movie.numberInStock++;
    // await movie.save();
    await Movie.updateOne({_id:rental.movie._id},{
        $inc:{numberInStock:1}
    })
    res.send(rental);
});

// PUT
// router.put('/:id', [auth, validateObjectId], async (req, res) => {});

// router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {});

module.exports = router;

// ****----****
// *1- Using the dot notation to access the id property within the customer subobject, inside the rental object
// *2- Using moment to calculate time diff between dateout and current date, and convert it into days
// *3- Once the code satisfies to all the neccesary test, it can be refactored to be more succint
// *4- The validator function and error message will likey be used in several places throughout the code. Make it a middleware function at middleware/validate.js

// *5-validator function, that takes a validate function as parameter is imported from middleware. Validate, the function passed as paramtere is passed from rental model

// *6- Refactored as a static method in models/rental.js

// *7- Per information expert principle, calculating date of return and so on should be better left in the model of the object, and called by the routes

// *8- Increasing number in stock by one, using mongoose built-in method.

// *9- express sends 200 status automatically upon succesful connection
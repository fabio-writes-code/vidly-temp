const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Movie } = require("../models/movies");
const { Customer } = require("../models/customer");
const { Rental, validate } = require("../models/rentals");

// GET
router.get("/", (req, res) => {
    //*Using promises
    const p = new Promise((resolve, reject) => {
        const rental = Rental.find().sort("-dateOut").select();
        resolve(rental);
    });
    p.then((resolve) => res.send(resolve));
});

router.get("/:id", async (req, res) => {
    const rental = await Rental.findById(req.params.id);
    !rental
        ? res.status(404).send("Customer does not exist")
        : res.send(rental);
});

// POST
router.post("/", async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // *Check customer and genre's id, and if movie in stock
    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send("Movie title does not exists");
    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send("Customer does not exists");
    if (movie.numberInStock === 0)
        return res.status(400).send("Movie not in stock");

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            isGold: customer.isGold,
            phone: customer.phone,
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate,
        },
    });

    // ! This code block should be treated as a transaction. Temporary brute force solution
    //*1
    rental = await rental.save();
    movie.numberInStock--; //*Decrease the stock number
    await movie.save((err) => {
        if (err) {
            errRemoveRental(rental);
            return res.status(400).send("Internal Server Error");
        }
        return res.status(200).send(rental);
    });
});

async function errRemoveRental(rental) {
    await Rental.findByIdAndDelete(rental._id);
}

// *2

// PUT
// router.put('/:id', async (req,res)=>{
//     const { error } =validate(req.body)
//     if (error) return res.status(400).send(error.details[0].message)

//     const genre=await Genre.findById(req.body.genreId);
//     if (!genre) return res.status(400).send('Invalid Genre')

//     const movie= await Movie.findByIdAndUpdate(req.params.id,{
//         title:req.body.title,
//         numberInStock:req.body.stock,
//         dailyRentalRate:req.body.rentaRate,
//         genre:{
//             _id:genre._id,
//             name:genre.name
//         }
//         },{new:true}
//     )
//     if (!movie) return res.status(400).send('Customer does not exist')
//     res.send(movie)
// })

// //DELETE
// router.delete('/:id', async (req,res)=>{
//     const movie=await Movie.findByIdAndRemove(req.params.id)
//     if (!movie) return res.status(400).send('Customer does not exist')
//     res.send(movie)
// })

module.exports = router;

// ****----****
// *1-There exists the possibility that after the rental object is saved, the server could crash and the new movie stock value might not be saved. To avoid this 'transactions' are used.
// *1.1-Transactions check that a series of operations are completed, or all of them are rolled back. Available for relational databases (SQL)
// *1.2-MongoDB supports transaction from 4.0.2. Additional info required

// *2-Movie return is handled by a different endpoint so the user does not have access to any sensible parameters, such as rates, date of return and so on. Rental fee, date returned and so on should be handled internally by the server.
// *2.1=Return requests will be handled by endpoint /api/returns with properties {customerId, movieId}, the end point will populate the return date, and rate; and return the info to the client

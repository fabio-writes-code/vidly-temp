const express=require('express')
const router=express.Router()
const mongoose=require('mongoose');
const {Movie,validate}=require('../models/movies');
const {Genre}=require('../models/genres') //* importing validate from genre

//* Route movie related requests from client. Handles express routes

// GET
router.get('/',(req,res)=>{ //*Using promises
    const p = new Promise((resolve,reject)=>{
        const movie=Movie
            .find()
            .sort('title')
            .select();
        resolve(movie)
    })
    p.then(resolve=>res.send(resolve))
})

router.get('/:id', async (req,res)=>{
    const movie=await Movie.findById(req.params.id)
    !movie? res.status(404).send('Customer does not exist'):res.send(movie)
})

// POST
router.post('/', async (req,res)=>{
    // *Validating user input. Check if client's input includes a string for genreId
    const { error } =validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    // *Using genreId check if genre exists in database and retrieves it
    const genre=await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid Genre')

    const movie=new Movie({ //*1
        title:req.body.title,
        numberInStock:req.body.numberInStock,
        dailyRentalRate:req.body.dailyRentalRate,
        genre:{ //*Specify which properties will be embedded in Movie
            _id:genre._id,
            name:genre.name
        }
    })
    await movie.save()
    res.send(movie)
})

// PUT
router.put('/:id', async (req,res)=>{
    const { error } =validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const genre=await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid Genre')

    const movie= await Movie.findByIdAndUpdate(req.params.id,{
        title:req.body.title,
        numberInStock:req.body.stock,
        dailyRentalRate:req.body.rentaRate,
        genre:{
            _id:genre._id,
            name:genre.name
        }
        },{new:true}
    )
    if (!movie) return res.status(400).send('Customer does not exist')
    res.send(movie)
})

//DELETE
router.delete('/:id', async (req,res)=>{
    const movie=await Movie.findByIdAndRemove(req.params.id)
    if (!movie) return res.status(400).send('Customer does not exist')
    res.send(movie)
})


module.exports=router;

// ****----****
// *1-Since Mongoose talks to mongo-driver, and objectId creation is handled by the driver, not the database. The objectId is generated before is stored inside mongoDB. The code can be re-writen, old syntaxis below
/**
 * let movie=new Movie({ //*1
        title:req.body.title,
        numberInStock:req.body.numberInStock,
        dailyRentalRate:req.body.dailyRentalRate,
        genre:{
            _id:genre._id,
            name:genre.name
        }
    })
    movie=await movie.save()
 */
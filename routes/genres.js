const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Genre, validate } = require('../models/genres');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
// const asyncMiddleware=require('../middleware/async')

//! Update genres so they work from the client's server to mongoDB database
// genres=[
//     {id:1,name:"Fantasy"},
//     {id:2,name:"Horror"},
//     {id:3,name:"Comedy"},
//     {id:4,name:"Drama"},
// ]

// GET
router.get('/', (req, res) => {
    //*Using promises
    // throw new Error('This is a custom error!!  Could not get the genres') //*5
    const p = new Promise((resolve) => {
        const genres = Genre.find().select();
        resolve(genres);
    });
    p.then((resolve) => res.send(resolve));
});

router.get('/:id', validateObjectId, async (req, res, next) => {
    //*4
    const genre = await Genre.findById(req.params.id);
    !genre ? res.status(404).send('Genre does not exist') : res.send(genre);
});

// POST

router.post('/', auth, async (req, res) => {
    //*1

    // *Genres should only modified by auth users

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    // const genre={id:genres.length+1,name:req.body.name}
    let genre = new Genre({ name: req.body.name });
    genre = await genre.save();
    // genres.push(genre)
    res.send(genre);
});

// PUT
router.put('/:id', [auth, validateObjectId], async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const genre = await Genre.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
        },
        { new: true }
    );
    // let genre=genres.find(g=>g.id===parseInt(req.params.id))
    if (!genre) return res.status(404).send('Genre does not exist');
    // genre.name=req.body.name;
    res.send(genre);
});

//DELETE
router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
    //*2
    const genre = await Genre.findByIdAndRemove(req.params.id);
    // let genre=genres.find(g=>g.id===parseInt(req.params.id))
    if (!genre) return res.status(404).send('Genre does not exist');
    // const index=genres.indexOf(genre)
    // genres.splice(index,1)
    res.send(genre);
});

module.exports = router;

// ****----User Authorization----****
// *1-Adding a middleware function to check user has the right credentials to add genres.
// *1.1-Form req.post(param1,param2,param3) where param2 is the imported middleware function
// *1.2-If not token is provided post will not take place

// *2-Two middleware functions need to be added to delete, the first one checks if the user is auth, and the second if it has admin privileges

// ****----Error Handling----****
// *3-To catch errors: if using promises include catch to the promise handled. If using async, await, use try, catch method (not included in the code). For escalability create a new middleware function

// *4-Adds next to parameters to pass control to the next function defined in startup/routes. In this case the error function. It turn, the error function has the syntaxis to properly deal with errors in a escalable manner

// *5-Adding ValidateObjectId as middleware function

// *5-Create a new error for testing

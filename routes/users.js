const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');
const { User, validate } = require('../models/users');
const _ = require('lodash')
const bcrypt = require('bcrypt');
const { route } = require('./rentals');
const auth = require('../middleware/auth')

// GET
router.get('/', (req, res) => { //*Using promises
    const p = new Promise((resolve, reject) => {
        const user = User
            .find()
            .select();
        resolve(user)
    })
    p.then(resolve => res.send(resolve))
})

// *8
router.get('/me', auth, async (req, res) => {
    // *With middleware added in jwtPrivateKey is not correct the rest of the get won't take place
    const user = await User.findById(req.user._id).select('-password')
    res.send(user)
})

router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id)
    !user ? res.status(404).send('User does not exist') : res.send(user)
})

// POST
router.post('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    // *Validate email for email registration //*1
    let user = await User.findOne({ email: req.body.email })
    if (user) return res.status(400).send('User already registered.')

    user = new User(_.pick(req.body, ['name', 'email', 'password'])) //*3

    // *Hashing user password
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt) //*4

    await user.save()

    // *Automating user authentication upon user creation.
    const token = user.generateAuthToken();

    // *5 *7
    // const token=jwt.sign({_id:user._id},config.get('jwtPrivateKey'))
    res
        .header('x-auth-token', token)//*6
        .header('access-control-expose-headers', 'x-auth-token')
        .send(_.pick(user, ['_id', 'name', 'email']))
    // res.send(_.pick(user,['_id','name','email'])) //*3 Using lodash

    // res.send({ //*2 custom response
    //     name:user.name,
    //     email:user.email
    // })
})

module.exports = router;

// ****----****
// *1-Validate that user's email has not been registered previously. Uses mongoose model method findOne and passes object with key value pair
// *2-Response need to be modified to avoid returning the password: two options: Define a custom response to send to client or use lodash (lodash.com). Lodash is an advanced type of underscore
// *3-Lodash is a utility tool that can be benefitial to make more succint code. lodash.pick, returns an object with the specified parameters.
// *4-Reset user password and replace it for the hashed version of it
// *5-Create a response header to authenticate user upon user creation

// *6-Sending back header using res.header(). Param1: Header name, arbitrary(should start with x-). Param2: value of the header
// *6.1-Client can then grab the header and store it to send back to server on API calls

// *7-If payload is modified, it would have to be updated in several places. To avoid that a function to update payload is prefered. This function is stored in models/users, since payload's information contains data defined in the user info primarily. This approach is called Information Expert Principle: Assigning responsibilites to the module that has the most info on them

// *-Regulat approach to router.get('/:id') is not desirable, since it allows anyone to send anyone's user id and retrieve their info
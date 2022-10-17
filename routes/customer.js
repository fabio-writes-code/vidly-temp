const express=require('express')
const router=express.Router()
const mongoose=require('mongoose');
const {Customer,validate}=require('../models/customer');

//* Holds the code to route customer related requests from client. Handles express routes

// GET
router.get('/',(req,res)=>{ //*Using promises
    const p = new Promise((resolve,reject)=>{
        const customer=Customer
            .find()
            .select();
        resolve(customer)
    })
    p.then(resolve=>res.send(resolve))
})

router.get('/:id', async (req,res)=>{
    const customer=await Customer.findById(req.params.id)
    !customer? res.status(404).send('Customer does not exist'):res.send(customer)
})

// POST
router.post('/', async (req,res)=>{
    const { error } =validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    let customer=new Customer({ name:req.body.name,isGold:req.body.isGold,phone:req.body.phone })
    customer=await customer.save()
    res.send(customer)
})

// PUT
router.put('/:id', async (req,res)=>{
    const { error } =validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    const customer= await Customer.findByIdAndUpdate(req.params.id,{
        name:req.body.name,
        isGold:req.body.isGold,
        phone:req.body.phone},
        {new:true}
    )
    if (!customer) return res.status(400).send('Customer does not exist')
    res.send(customer)
})

//DELETE
router.delete('/:id', async (req,res)=>{
    const customer=await Customer.findByIdAndRemove(req.params.id)
    if (!customer) return res.status(400).send('Customer does not exist')
    res.send(customer)
})


module.exports=router;
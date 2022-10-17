const {User}=require('../../../models/users')
const jwt=require('jsonwebtoken')
const config=require('config')
const mongoose=require('mongoose')

describe('user.generateAuthToken test suite',()=>{
    it('should return a valid JWT',()=>{
        const payload={ //define the payload that JWT stores
            _id: new mongoose.Types.ObjectId().toHexString(),
            isAdmin:true}
        const user=new User(payload) //create a new user with the info contained in the payload
        const token=user.generateAuthToken(); //create a new auth token
        const decoded = jwt.verify(token,config.get('jwtPrivateKey')) //decoding the given jwt
        expect(decoded).toMatchObject(payload) //payload has to have initial info the check that jwt coding and decoding is working properly
        console.log(`user: ${user}, token: ${token}, decoded: ${decoded}`);

    })
})

// ****----****
// *1-By default jest configures NODE_ENV to be 'test'. The config file for the environment needs to be added in config to avoid errors.
// *1.1- JWT private key can also be defined within the test config file to avoid having to set the key manually
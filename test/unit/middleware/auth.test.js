const auth = require("../../../middleware/auth");
const { User } = require("../../../models/users")
const mongoose=require('mongoose')

describe('Auth middleware',()=>{
    it('Should populate req.user with the payload of a valid JWT',()=>{
        const user={ //*1
            _id:mongoose.Types.ObjectId().toHexString(),
            isAdmin:true
        }
        const token=new User(user).generateAuthToken();
        // *Mocking all the required functions for auht(req,res,next)
        const req={
            header:jest.fn().mockReturnValue(token)
        }
        const res={}
        const next=jest.fn()
        auth(req,res,next);
        expect(req.user).toMatchObject(user);
    })
})

// *1-Creating an actual user with proper Id to check if auth function works properly

const jwt=require('jsonwebtoken')
const config=require('config')

module.exports = function (req,res,next){ //*4
    const token=req.header('x-auth-token') //*2
    if(!token) return res.status(401).send('Access denied. No token provided')

    // *Verify that the token is valid //*3
    try {
        const decoded = jwt.verify(token,config.get('jwtPrivateKey'))
        req.user=decoded
        next()
    } catch (ex) {
        res.status(400).send('Invalid Token')
    }
}



// ****----****
// *1-Defining user authentication and privileges
// *2-req.header(param1) returns the header info in the client's request that correspons to param1

// *3-jwt.verify(param1,param2) verifies the passed token in param1 with the given private key in param2, returning token's payload if info verification is true

// *4-Alternate notation for expoting modules
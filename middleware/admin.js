
//TODO:Checks the admin role of the user to access genres delete

module.exports=function (req,res,next){
    // *req.user This function follows auth middleware, so user has already been retrieved
    if (!req.user.isAdmin) return res.status(403).send('Access Denied') //*1
    next(); 
}

// *1-(401) unauthorized for users trying to access protected resources without a valid token, but can ber retried.
// *1.1-(403) with a valid jwt but no access to the resource

// *2-When considering what to include in a unit test, check the dependencies of the function, the more complex the dependencie the harder it'll be to mock. In this case the req and res arguments would have to me mocked, along with its properties and methods. Making testing cumbersome and time consuming
// *2.1-Choose functions with minimal dependencies
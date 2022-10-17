
module.exports = function (handler){
    return async(req,res,next)=>{ //*2 //*3 
        try { //*1
            await handler(req,res)
        }
        catch(ex){
            next(ex)
        } 
    }
}

// *1-The function attempts to execute the async function passed as parameter.
// *2 Express route handlers of type router.get(), router.post() and so on have syntaxis of router.get(param1,param2) where param1 is the api route, and param2 is a route handler function with form (req, res, next). For the async function to work with express routers, it has to return a similar route handler function, that will attempt to execute the handler's code upon request and return an expection if it fails
// *3-The return syntaxis provides the handler function with the required request and response objects.
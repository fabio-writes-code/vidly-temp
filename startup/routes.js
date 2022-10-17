// TODO: Setting up all routes and middleware
// *1
const express = require("express");
const genres = require("../routes/genres");
const customers = require("../routes/customer");
const movies = require("../routes/movies");
const rentals = require("../routes/rentals");
const users = require("../routes/users");
const auth = require("../routes/auth");
const returns = require("../routes/returns");

const error = require("../middleware/error");

module.exports = function (app) {
    app.use(express.json());
    app.use("/api/rentals", rentals);
    app.use("/api/genres", genres);
    app.use("/api/customer", customers);
    app.use("/api/movies", movies);
    app.use("/api/users", users);
    app.use("/api/returns", returns);
    app.use("/api/auth", auth);
    app.use(error); //*3 //*4
};

// *1-Avoid repeating import of modules. Export the function and pass the necessary app parameter when the function is called by the index module.

// *3-Error middleware function. Must be added after all the other functions

// *4 For escalability and clarity the error handling function should be defined separatedly and then passed to the routes. The route handler function is wraped within the new error handling functtion.
// *4.1-To remove the wrapping function, making the code more legible. Use module package express-async-errors

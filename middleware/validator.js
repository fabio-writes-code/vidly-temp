//* Validator function
module.exports = (validator) => {
    //*1
    return (req, res, next) => {
        const { error } = validator(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        next();
    };
};

// *1- The validator function needs to be able to address different types of validations depending on what the client's input is exected to be. Therefore, pass validate funtion as a parameter and return the result of the validation if error, if no error then next.

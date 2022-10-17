<!--
TODO: This file contains an index of what concepts are explained within the directory and where to find them:

* Transacions and Transactions in MongoDB -> routes/rentals
* objectId is handled by mongo-driver not mongoDB -> routes/movies
* joi-objectId -> models/rentals
* Nesting mongoose schemas for relational databases  -> models/rentals
* Difference between joi validate and mongoose schema validate  -> models/movies

TODO: Authorization and Authentication
* Authorization and authentication -> models/users
* Avoid email duplicated -> routes/users
* Creating custom responses -> routes/users
* Lodash -> routes/users
* joi-password-complexity -> models/users
* use bcrypt to hash user passwords -> routes/users
* JSON webtokens -> routers/auth
* fail to load jwtPrivateKey and process.exit() ->startup/config.js
* returning info headers -> routes/users.js
* Information Expert Principle -> routes/users.js
* Adding generateAuthToken() to user model -> models/users.js
* Retrieving generateAsuthToken() for scalability -> routes/auth.js
* Levels of authorization -> middleware/auth.js
* Verifying token and returning payload ->middleware/auth.js
* Logging off -> routes/auth
* Role based authorization -> models/user, routes/genres.post

TODO: Error handling
* Handling rejected promises -> routes/genres.js
* Error message middleware function -> middleware/error.js
* Passing info to error message middleware function -> routes/genres.js
* Async try catch function (not in code, see video) -> middleware/async.js
* Async try catch route handler approach -> routes/genres.js
* Using express-async-errors npm (not in code, see video) ->startup/logger.js

TODO: Logging Errors:
* using winston (npm i winston)
* winston and transports -> /startup/logger
* winston logs -> middleware/errors.js
* logging uncaught exceptions and rejected promises-> /startup/logger

TODO: Refactoring index.js:
* passing the app arguement to route handlers defined by an outside function -> startup/routes
 -->

<!--
TODO Unit Testing
* unit test considerations -> middleware/admin
* Unit test example -> models/users
* Setting NODE_ENV for jest -> test/unit/models/users.js

TODO Integration Testing
* Choosing the correct db according to environment -> startup/db.js
* Avoiding 'server already in use' upon jest save -> test/integration/genres.test.js
* Exporting server object -> index.js
* Generating objects for testing -> test/integration/genres.test.js

 -->

<!--
TODO Returning Movies and Test driven development
* Separate endpoint to return movies -> routes/rentals.js
* Test driven development for returnign rentals -> test/integration/returns.js
* Moment library to emulate timeframes -> test/integration/returns.js
* Accesing subobjects with dot notation -> routes/returns.js
* using moment to calculate lapses of time -> routes/returns.js
* Middleware validate function that returns a validator function for user input -> middleware/validator.js
 -->

<!--
TODO bcrypt
* BCrypt is used to encrypt and verify passwords, whereas jwt generates an internal user id that authorizes different privilege levels for admins and permissions over what can different user do and modify within the app.
 -->

<!--
TODO Integration Testing
* While unit test works to verify the funtionality of self contained algorithms, integration tests check the funtionality of functions with multiple dependiencies.
* Require a test database to work with for mock http request and so on
* in package.json change the test property to add the '--verbose' flag. Gives more info upon test
* add "db" to default and test config files to select the correct db for the environment
! Remember to change the environment to test, cdm set NODE_ENV=test
* cmd npm i supertest --save-dev: Emulates clients's requests, like postman
* Adding --coverage to test in package.json display what coverage the tests have covered so far, either directly or through other tests
 -->

<!--
TODO Test driven development
* Tests are designed first, before any line of code.
* Code is created so that all the tests designed are met, guaranteeing cleaner more succint code
 -->

<!-- 
TODO Deployment
* In general deployment has two options. PaaS (Platform as a Service) or docker:
* Paas: Heroku, google could platform, AWS, azure. Platform is provided so there's no need to worry about infrastructure, no need to worry about servers, reverse balances, proxys or restarting an app on crash.
* Docker: Creates an image of the app, for deployment in your own webserver or any computer.
 -->

<!-- 
TODO Using Heroku
* npm i helmet: Middleware package that covers against well know web vulnerabilities
* npm i compression: compress the http response sent to the client
* Middleware funcionality is stored in startUp/prod.js
* Heroku will run the application usign npm start which is manually added to package.json underneath test
* In package.json underneath start, add engines{} object and specify the node version used by the app
* Add code to gir repository
* cmd "Heroku create" creates a git remote in the local git environment, changes need to be pushed to heroku.
* cmd "git remote -v" will display the remote repositories associated with the app
* cmd "git push heroku master" to push changes in the app to heroku's main branch. Returns the http address for the app
 -->

 <!-- 
 * ./config/default.json defines a template or mapping of the settings for the app
 * ./config/custom-environment-variables.json stores jwt's digital signature. Prefix the environment variable with the app name ("vidly_") to prevent one app setting overriding another app setting
 * Setting the evironment variable: cmd "set vidly_jwtPrivateKey=customString" 
  -->

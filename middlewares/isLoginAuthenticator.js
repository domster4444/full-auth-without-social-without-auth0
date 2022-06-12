//? FOR PRIVATE ROUTE WE CHECK BY USING THIS MIDDLE WARE
//!this middleware check if user is logged in or not by checking clients's token saved in localStorage
// it checks if user has token, if user has token (it means he/she is loggedin note:user is logged in after registration too)
//if token if found & valid then, it will allow user to access private route
// to access private route, user must have token (token that he/she gets when loggedin (after registration/after login he/she gets token from server that they save later in localstorage ))
//TO access private route, user must have token. that is what we do here , check if user has token or not (is logged in or not)
const jwt = require('jsonwebtoken');
const userModel = require('../models/User');

var checkIfUserIsLoggedIn = async (req, res, next) => {
  let token;

  // ---------------dummy header object has following property------------
  //   {
  // Accept:application/json
  // Authorization:Bearer 124546thisistoken125468789132468789dsfdsfjlkesncksdourennes
  //   }
  // -------------------------------------------------------------------

  // req.header has all the headers that client sent to server
  const { authorization } = req.headers;

  //check if  req.headerObject's authorization property is not empty
  if (authorization && authorization.startsWith('Bearer')) {
    try {
      token = authorization.split(' ')[1];
      //verify jwt token sent by client
      /**
       * why we destructured userId is because we want to get userId from token,how we get userId from token?
       * we can get userId from token because we saved userId in token when we created token
       * so we can get userId from token by destructuring token after verifying 
       * 
       * This is what we did when creating token, you see that we saved userId in token,so when verifying we can get userId from token 
       *    const token = jwt.sign(
              { userId: user._id },
              process.env.JWT_SECRET_KEY,
              { expiresIn: '5d' }
            );
       */
      const { userId } = jwt.verify(token, process.env.JWT_SECRET_KEY); // even if it gets verified , we still need to check if userId of token we got is valid or not(exist in db or not)
      //? set req object's user value (req.user)  to the data of user of db without password property by using userId that we got after fetching userId from token
      req.user = await userModel.findById(userId).select('-password'); // provided all data of user except password
      next();
    } catch (err) {
      console.log(err);
      res.status(401).json({
        status: 'failed',
        message: 'Invalid Token,Unauthorized access is prohibited',
      });
    }
  } else if (!token) {
    //check if "Authorization" property is not present in req.headerObject's OR req.headerObject's authorization property is  empty
    // then in such case below code will run, as by default "token" variable is not defined in this case, "token" variable is undefined
    res.status(401).json({
      status: 'failed',
      message:
        'You are not logged in, please login first,no token found in your req.header object',
    });
  } else {
    res.status(401).json({
      status: 'failed',
      message: 'internal server error',
    });
  }
};

module.exports = checkIfUserIsLoggedIn;

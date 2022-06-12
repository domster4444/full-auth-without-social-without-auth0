const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

//Route level middleware-to protect routes
const checkIfUserIsLoggedIn = require('../middlewares/isLoginAuthenticator');
router.use('/changepassword', checkIfUserIsLoggedIn); //!this auth middleware is triggered before hitting /changepassword route
router.use('/getloggeduserdata', checkIfUserIsLoggedIn); //!this auth middleware is triggered before hitting /changepassword route

//public routes
router.post('/register', userController.userRegistration);
router.post('/login', userController.userLogin);
router.post(
  '/send-user-password-reset-email',
  userController.sendUserPasswordResetEmail
);
router.post('/reset-password/:id/:token', userController.userPasswordReset);

//protected routes
router.post('/changepassword', userController.changePassword);
router.get('/getloggeduserdata', userController.getLoggedUserData);

module.exports = router;

const transporter = require('../config/emailConfig');
const userModel = require('../models/User');
// to hash password before saving
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

class UserController {
  // ==============================================================================2 ROUTE FOR RESET EMAIL==========================================================================================

  //? send link with id & token(dynamicUserId<whoever's you want to reset>+secretKey) if email exists
  // also send id in :id param & token in :token param
  static sendUserPasswordResetEmail = async (req, res) => {
    const { email } = req.body;

    if (email) {
      const user = await userModel.findOne({ email });
      if (user) {
        const secret = user._id + process.env.JWT_SECRET_KEY; // unique secret key SECRET KEY is different for each user
        //?generate token for link-token
        const token = jwt.sign({ userId: user._id }, secret, {
          // email valid for  15 minutes
          expiresIn: '15d',
        });

        const link = `${process.env.FRONT_END_LINK}/api/users/reset/${user._id}/${token}`; //! /api/users/react/:id/:token for fronte  nd

        console.log(link);

        // send email
        let info = await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: user.email,
          subject: 'Password Reset Link',
          html: `
          <h1>
          <a href=${link}>
          Click Here to Reset Password
          </a>
          </h1>
          `,
        });

        res.status(200).json({
          status: 'success',
          message: 'Email sent successfully',
          data: info,
        });
      } else {
        res.status(400).json({
          status: 'failed',
          message: 'User not found',
        });
      }
    } else {
      res.status(200).json({
        status: 'failed',
        message: 'all fields is required',
      });
    }
  };

  /* HOW IT WORKS*/
  //user get link in gmail, he hits' that link , get redirected to dynamic link of front end
  //  `${process.env.FRONT_END_LINK}/api/users/reset/${user._id}/${token}`;
  // there exist a form with 2 fields, password,confirm password
  // he fill up the form
  // he hits submit button
  // on submit button, he sends a req to this route with :id param , token param that client gets from linkurl,and password and confirm password
  // router.post('/reset-password/:id/:token', userController.userPasswordReset);
  // then this below function is called

  static userPasswordReset = async (req, res) => {
    const { password, password_confirmation } = req.body;
    // http://localhost:3000/api/users/:id/:token
    const { id, token } = req.params;
    const user = await userModel.findById(id);
    //to check validation of token -> generate token using same id and secret key that we used while creating token for Link in sendUserPasswordResetEmail Route
    const new_token = user._id + process.env.JWT_SECRET_KEY; //unique secret key for each user
    try {
      console.log('___token');
      console.log(token);
      console.log('___id');
      console.log(id);
      jwt.verify(token, new_token);
      // check if both has data
      if (password && password_confirmation) {
        if (password === password_confirmation) {
          //convert new-password to hash
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);
          // update password
          await userModel.findByIdAndUpdate(user._id, {
            password: hashedPassword,
          });
          res.status(200).json({
            status: 'success',
            message: 'password reset successfully',
          });
        } else {
          res.status(400).json({
            status: 'failed',
            message: 'confirm pass dont match',
          });
        }
      } else {
        res.status(400).json({
          status: 'failed',
          message: 'Please fill all the fields',
        });
      }
    } catch (err) {
      return res.status(401).json({
        status: 'failed',
        message: 'Token is not valid',
      });
    }
  };

  // ========================================================================================================================================================================

  static getLoggedUserData = async (req, res) => {
    res.status(200).json({
      status: 'success',
      message: 'User data fetched successfully',
      data: {
        user: req.user,
      },
    });
  };

  static changePassword = async (req, res) => {
    const { new_password, new_password_confirmation } = req.body;
    //check if fields are not empty
    if ((new_password, new_password_confirmation)) {
      // check if new password and new password comfirmation are the same
      if (new_password === new_password_confirmation) {
        //?convert new password to hash
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(new_password, salt);
        // console.log(req.user); //* we got this user object from middleware, on successful validation , isLoggInAuthenticator will fetch userId of token and find user from db with that userId and set req.user value to user-data of that userId
        //?update password in db
        await userModel.findByIdAndUpdate(req.user._id, {
          password: hashedPassword,
        }); // i didn't assigned it to "const user =" because this expression just find & updates only but dont return any data
        res.status(200).json({
          status: 'success',
          message: 'password changed successfully',
        });
      } else {
        res.status(400).json({
          status: 'failed',
          message: 'Password and Confirm Password does not match',
        });
      }
    } else {
      res.status(400).json({
        status: 'failed',
        message: 'Please fill all the fields',
      });
    }
  };

  static userLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      //check if email and password field are not empty
      if (email && password) {
        //check if user exist
        const user = await userModel.findOne({ email: email });
        // if user exist
        if (user != null) {
          //check if password match
          const isPasswordMatch = await bcrypt.compare(password, user.password);
          // check if email match
          const isEmailMatch = email === user.email ? true : false;
          if (isEmailMatch == true && isPasswordMatch == true) {
            //?create token using user's id
            //first find user which you just created from same email of req.body. just find it first
            const user = await userModel.findOne({ email });
            // use just created user's id for token creation
            const token = jwt.sign(
              { userId: user._id },
              process.env.JWT_SECRET_KEY,
              { expiresIn: '5d' }
            );

            res.status(200).json({
              status: 'success',
              message: 'login success',
              token: token,
            });
          } else {
            res.status(400).json({
              status: 'failed',
              message:
                'Invalid email or password, i dont know which one is wrong , XD',
            });
          }
        } else {
          res.status(404).json({
            status: 'failed',
            message: 'No user with that email exist',
          });
        }
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'user could not be logged in due to server error',
      });
    }
  };

  static userRegistration = async (req, res) => {
    const { name, email, password, password_confirmation, tc } = req.body;
    // check if user already exists
    const userAlreadyExist = await userModel.findOne({ email });
    if (userAlreadyExist) {
      res.status(400).json({
        status: 'failed  ',
        message: 'User already exists',
      });
    } else {
      //if user does not exist

      //check if all fields are filled
      if (name && email && password && password_confirmation && tc) {
        //check if password and password confirmation are the same
        if (password === password_confirmation) {
          //if all fields are filled && password and password confirmation are the same

          try {
            //hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            //create model for user  to register
            const doc = await userModel.create({
              name,
              email,
              password: hashedPassword,
              tc,
            });

            //?create token using user's id
            //first find user which you just created from same email of req.body. just find it first
            const user = await userModel.findOne({ email });
            // use just created user's id for token creation
            const token = jwt.sign(
              { userId: user._id },
              process.env.JWT_SECRET_KEY,
              { expiresIn: '5d' }
            );

            //send response to avoid server from keep on sending signal [201-created status code]
            res.status(201).json({
              status: 'success',
              message: 'User registered successfully',
              //   !Dont forget to send token to client
              token: token,
            });
          } catch (err) {
            console.log(err);
            res.status(400).json({
              status: 'failed  ',
              message: 'unable to register user',
            });
          }
        } else {
          res.status(400).json({
            status: 'failed  ',
            message: 'Password and password confirmation do not match',
          });
        }
      } else {
        res.status(400).json({
          status: 'failed  ',
          message: 'All fields are required',
        });
      }
    }
  };
}

module.exports = UserController;

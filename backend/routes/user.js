const express = require("express")
const { body, validationResult } = require("express-validator")


// controller functions
const { loginUser,  signupUser } = require("../controllers/userController")

// invokes to make an instance of the express router
const router = express.Router()

//log in route 
// #1 express-validator confimed with Postman
// checks for empty fields, invalid email format

router.post('/login', [
    body('email').not().isEmpty().withMessage('Email is required').bail()
               .isEmail().withMessage('Invalid email format'),
    body('password').not().isEmpty().withMessage('Password is required'),
  ], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  }, loginUser);

// #2 validator confimed with Postman
//router.post("/login", loginUser)

//signup route
// #1 express-validator 
// checks for empty fields, invalid email format
router.post("/signup", [
    body('email').not().isEmpty().withMessage('Email is required').bail()
               .isEmail().withMessage('Invalid email format'),
    body('password').not().isEmpty().withMessage('Password is required'),
  ], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  }, signupUser);

// #2 validator
router.post("/signup", signupUser)



module.exports = router
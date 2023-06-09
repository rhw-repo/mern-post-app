const express = require("express")

// controller functions
const { loginUser,  signupUser } = require("../controllers/userController")

// invokes to make an instance of the express router
const router = express.Router()

//log in route
router.post("/login", loginUser)

//signup route
router.post("/signup", signupUser)

module.exports = router
const mongoose = require("mongoose")
// hashes and adds a unique salt (extra characters) to each password
const bcrypt = require("bcrypt")
// package validates input field values
const validator = require("validator")

const Schema = mongoose.Schema

// unique set to true to prevent two accounts using same email address
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    }
})

// signup method checks email unique, if not send error message
// error messages revised to not identify specific issue for security purposes
userSchema.statics.signup = async function(email, password) {

    // validation
    if (!email || !password) {
        throw Error("All fields must be filled")
    }
    if (!validator.isEmail(email)) {
        throw Error("Incorrect log in details")
    }
    if (!validator.isStrongPassword((password))) {
        throw Error("Incorrect format")
    }

    const exists = await this.findOne({ email })

    if (exists) {
        throw Error("This email address is not available. Please use another address.")
    }

    // generate salt
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = await this.create({ email, password: hash })

    return user
}

// login method
// error messages revised to not identify specific issue for security purposes
userSchema.statics.login = async function (email, password) {
    if (!email || !password) {
        throw Error("All fields must be filled")
    }

    const user = await this.findOne({ email })

    if (!user) {
        throw Error("Incorrect log in details")
    }

    const match = await bcrypt.compare(password, user.password)

    if (!match) {
        throw Error("Incorrect log in details")
    }

    return user
}

module.exports = mongoose.model("User", userSchema)
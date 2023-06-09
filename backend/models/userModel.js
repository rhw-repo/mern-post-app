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
userSchema.statics.signup = async function(email, password) {

    // validation
    if (!email || !password) {
        throw Error("All fields must be filled")
    }
    if (!validator.isEmail(email)) {
        throw Error("Email is not valid")
    }
    if (!validator.isStrongPassword((password))) {
        throw Error("Password is not strong enough")
    }

    const exists = await this.findOne({ email })

    if (exists) {
        throw Error("Email already in use")
    }

    // generate salt
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = await this.create({ email, password: hash })

    return user
}

// login method
userSchema.statics.login = async function (email, password) {
    if (!email || !password) {
        throw Error("All fields must be filled")
    }

    const user = await this.findOne({ email })

    if (!user) {
        throw Error("Email incorrect")
    }

    const match = await bcrypt.compare(password, user.password)

    if (!match) {
        throw Error("Password incorrect")
    }

    return user
}

module.exports = mongoose.model("User", userSchema)
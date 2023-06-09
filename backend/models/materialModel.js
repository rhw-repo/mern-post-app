const mongoose = require('mongoose')
const Schema = mongoose.Schema

// form submission rejected unless all fields meet these requirements
const materialSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    tags: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Material', materialSchema)


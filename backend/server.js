// package, loads sensitive env vars from .env file into process.env object 
require('dotenv').config()

let express = require('express')
const mongoose = require('mongoose')
// provides routes for materials
const materialRoutes = require('./routes/materials')
const userRoutes = require('./routes/user')
mongoose.set('strictQuery', true);

// express app
let app = express()
// TODO discover why setting is ignored. Cached?
app.disable('x-powered-by')

// middleware
app.use(express.json())

app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

// routes
app.use('/api/materials', materialRoutes)
app.use('/api/user', userRoutes)

// connect to db
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('connected to database')
    // listen to port
    app.listen(process.env.PORT, () => {
      console.log('listening for requests on port', process.env.PORT)
    })
  })
  .catch((error) => {
    console.log(error)
  }) 
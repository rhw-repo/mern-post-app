//access granted if token present & valid, else prevented & error response sent
// create instance of express
const express = require('express')

const {
  createMaterial,
  getMaterials,
  getMaterial,
  deleteMaterial,
  updateMaterial,
  getAllTags
} = require("../controllers/materialController")

const requireAuth = require("../middleware/requireAuth")

// creates new instance of a router object
const router = express.Router()

// attaches the instance of the router, stored in variable 'router'
// require auth for all material routes
router.use(requireAuth)

// GET all materials
router.get('/', getMaterials)

// GET a single material
router.get('/:id', getMaterial)

// POST a new material
router.post('/', createMaterial)

// DELETE a material
router.delete('/:id', deleteMaterial)

// UPDATE a material
router.patch('/:id', updateMaterial)

// GET all tags
router.get('/tags', getAllTags)

//exports the router
module.exports = router
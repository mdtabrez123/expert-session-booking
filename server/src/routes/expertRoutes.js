const express = require('express');
const router = express.Router();
const {
  getExperts,
  getExpertById,
  createExpert,
} = require('../controllers/expertController');

// GET  /api/experts          — List all experts (pagination + category filter)
// POST /api/experts          — Create a new expert
router.route('/').get(getExperts).post(createExpert);

// GET  /api/experts/:id      — Get a single expert by ID
router.route('/:id').get(getExpertById);

module.exports = router;

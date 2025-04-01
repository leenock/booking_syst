const express = require("express");
const router = express.Router();
const {
  getAllVisitors,
  getVisitorById,
  createVisitor,
  deleteVisitor,
  updateVisitor,
} = require("../controllers/visitorController");

// Basic CRUD routes
router.get('/', getAllVisitors); // Get all visitors
router.get('/:id', getVisitorById); // Get single visitor
router.post('/', createVisitor); // Create new visitor
router.put('/:id', updateVisitor); // Update visitor
router.delete('/:id', deleteVisitor); // Delete visitor

module.exports = router;

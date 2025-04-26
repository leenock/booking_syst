const express = require("express");
const router = express.Router();
const {
  getAllVisitors,
  getVisitorById,
  createVisitor,
  deleteVisitor,
  updateVisitorFrontend,
  updateVisitor,
  loginVisitor,
  logoutVisitor,
  forgotPassword,
  resetPassword,
} = require("../controllers/visitorController");

// Basic CRUD routes
router.get('/', getAllVisitors); // Get all visitors
router.get('/:id', getVisitorById); // Get single visitor
router.post('/', createVisitor); // Create new visitor
router.put('/user/:id', updateVisitorFrontend); // Update visitor frontend
router.put('/:id', updateVisitor); // Update visitor
router.delete('/:id', deleteVisitor); // Delete visitor
// Additional routes for visitor management
router.post('/login', loginVisitor); // login visitor
router.post('/logout', logoutVisitor); // logout visitor
router.post('/forgot-password', forgotPassword); // forgot password
router.post('/reset-password/', resetPassword); // reset password
// Additional routes for visitor management

module.exports = router;

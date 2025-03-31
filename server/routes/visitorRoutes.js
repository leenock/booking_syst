const express = require('express');
const router = express.Router();
const {
    getAllVisitors,
    getVisitorById,
    createVisitor,
    updateVisitor,
    deleteVisitor
} = require('../controllers/visitorController');
const { validateVisitor } = require('../middleware/validation');


router.get('/', getAllVisitors); // Get all visitors
router.get('/:id', getVisitorById); // Get visitor by ID
router.post('/', validateVisitor, createVisitor); // Create new visitor
router.put('/:id', validateVisitor, updateVisitor); // Update visitor
router.delete('/:id', deleteVisitor); // Delete visitor

module.exports = router; 
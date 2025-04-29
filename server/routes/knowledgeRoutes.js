const express = require('express');
const router = express.Router();

const {
    getAllKnowledgeBaseArticles,
    getKnowledgeBaseArticleById,
    updateKnowledgeBaseArticleById,
    deleteKnowledgeBaseArticleById,
    createKnowledgeBaseArticle
} = require('../controllers/knowledgeBaseController');

// Define the routes for the knowledge base

// Get all knowledge base articles
router.get('/', getAllKnowledgeBaseArticles);

// Get a knowledge base article by ID
router.get('/:id', getKnowledgeBaseArticleById);

// Update a knowledge base article by ID
router.put('/:id', updateKnowledgeBaseArticleById);

// Delete a knowledge base article by ID
router.delete('/:id', deleteKnowledgeBaseArticleById);

// Create new room
router.post('/', createKnowledgeBaseArticle);

module.exports = router;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all knowledge base articles
const getAllKnowledgeBaseArticles = async (req, res) => {
    try {
        const articles = await prisma.knowldgeBase.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.status(200).json({
            success: true,
            count: articles.length,
            data: articles
        });
    } catch (error) {
        console.error('Error fetching knowledge base articles:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch knowledge base articles',
            message: error.message 
        });
    }
};

// Get a single knowledge base article by ID
const getKnowledgeBaseArticleById = async (req, res) => {
    try {
        const { id } = req.params;
        const article = await prisma.knowldgeBase.findUnique({
            where: {
                id: id
            }
        });

        if (!article) {
            return res.status(404).json({
                success: false,
                error: 'Knowledge base article not found',
                message: 'The knowledge base article with the specified ID does not exist.'
            });
        }

        res.status(200).json({
            success: true,
            data: article
        });
    } catch (error) {
        console.error('Error fetching knowledge base article by ID:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch knowledge base article by ID',
            message: error.message 
        });
    }
};

// Create a new knowledge base article
const createKnowledgeBaseArticle = async (req, res) => {
    try {
        const { question, answer } = req.body;

        const newArticle = await prisma.knowldgeBase.create({
            data: {
                question,
                answer
            }
        });

        res.status(201).json({
            success: true,
            data: newArticle
        });
    } catch (error) {
        console.error('Error creating knowledge base article:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create knowledge base article',
            message: error.message
        });
    }
};


// Update a knowledge base article by ID
const updateKnowledgeBaseArticleById = async (req, res) => {
    try {
        const { id } = req.params;
        const { question, answer } = req.body;

        const updatedArticle = await prisma.knowldgeBase.update({
            where: {
                id: id
            },
            data: {
                question,
                answer
            }
        });

        res.status(200).json({
            success: true,
            data: updatedArticle
        });
    } catch (error) {
        console.error('Error updating knowledge base article by ID:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to update knowledge base article by ID',
            message: error.message 
        });
    }
};

// Delete a knowledge base article by ID
const deleteKnowledgeBaseArticleById = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedArticle = await prisma.knowldgeBase.delete({
            where: {
                id: id
            }
        });

        res.status(200).json({
            success: true,
            data: deletedArticle
        });
    } catch (error) {
        console.error('Error deleting knowledge base article by ID:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to delete knowledge base article by ID',
            message: error.message      
        });
    }   
};

module.exports = {
    getAllKnowledgeBaseArticles,
    getKnowledgeBaseArticleById,
    createKnowledgeBaseArticle,
    updateKnowledgeBaseArticleById,
    deleteKnowledgeBaseArticleById
};

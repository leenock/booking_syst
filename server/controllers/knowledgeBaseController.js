const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get all knowledge base articles
const getAllKnowledgeBaseArticles = async (req, res) => {
  try {
    const articles = await prisma.$queryRaw`
        SELECT id, question, answer, "created_at", vector::text AS vector
        FROM "KnowldgeBase"
        ORDER BY "created_at" DESC
      `;

    res.status(200).json({
      success: true,
      count: articles.length,
      data: articles,
    });
  } catch (error) {
    console.error("Error fetching knowledge base articles (raw):", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch knowledge base articles (raw)",
      message: error.message,
    });
  }
};

// Get a single knowledge base article by ID
const getKnowledgeBaseArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await prisma.knowldgeBase.findUnique({
      where: {
        id: id,
      },
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        error: "Knowledge base article not found",
        message:
          "The knowledge base article with the specified ID does not exist.",
      });
    }

    res.status(200).json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error("Error fetching knowledge base article by ID:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch knowledge base article by ID",
      message: error.message,
    });
  }
};

// Create a new knowledge base article
// POST /api/knowledge-base from pycharm project -- note that this is a post request
const createKnowledgeBaseArticle = async (req, res) => {
  try {
    const { question, answer } = req.body;

    // 1. Get embedding vector from your local FastAPI server
    const response = await axios.post("http://localhost:8000/embed", {
      text: question,
    });

    const vector = response.data.embedding; // Ensure this is the vector you received

    // Convert array to Postgres-compatible format for pgvector
    const vectorStr = `'[${vector.join(",")}]'`;

    // 2. Insert the new knowledge base article with the vector
    const insertQuery = `
          INSERT INTO "KnowldgeBase" (id, question, answer, created_at, vector)
          VALUES (uuid_generate_v4(), $1, $2, NOW(), ${vectorStr})
          RETURNING id, question, answer, created_at;
        `;

    const inserted = await prisma.$queryRawUnsafe(
      insertQuery,
      question,
      answer
    );

    res.status(201).json({
      success: true,
      data: inserted[0],
    });
  } catch (error) {
    console.error("❌ Failed to insert:", error);
    res.status(500).json({
      success: false,
      message: "Failed to insert article with vector",
      error: error.message,
    });
  }
};

// Bulk create knowledge base articles
const createBulkKnowledgeBaseArticles = async (req, res) => {
  try {
    const articles = req.body;

    if (!Array.isArray(articles)) {
      return res.status(400).json({
        success: false,
        error: "Invalid input",
        message: "Expected an array of articles",
      });
    }

    const values = [];

    for (const article of articles) {
      const { question, answer } = article;

      if (!question || !answer) {
        return res.status(400).json({
          success: false,
          error: "Validation failed",
          message: 'Each article must include "question" and "answer"',
        });
      }

      // Get vector from embedding server
      const response = await axios.post("http://localhost:8000/embed", {
        text: question,
      });

      const vector = response.data.embedding || response.data.vector;

      if (!Array.isArray(vector)) {
        return res.status(500).json({
          success: false,
          error: "Embedding generation failed",
          message: `Failed to generate embedding for question: "${question}". Embedding vector not returned or invalid format`,
        });
      }

      const vectorStr = `'[${vector.join(",")}]'`;
      const id = uuidv4();

      // Prepare value string for raw SQL
      values.push(
        `('${id}', '${question.replace(/'/g, "''")}', '${answer.replace(/'/g, "''")}', NOW(), ${vectorStr})`
      );
    }

    if (!values.length) {
      return res.status(400).json({
        success: false,
        message: "No valid articles to insert",
      });
    }

    const insertQuery = `
        INSERT INTO "KnowldgeBase" (id, question, answer, created_at, vector)
        VALUES ${values.join(",")}
        RETURNING id, question, answer, created_at;
      `;

    const inserted = await prisma.$queryRawUnsafe(insertQuery);

    res.status(201).json({
      success: true,
      message: `${inserted.length} article(s) inserted with vector successfully`,
      data: inserted,
    });
  } catch (error) {
    console.error("❌ Error in bulk insert:", error);
    res.status(500).json({
      success: false,
      error: "Bulk insert failed",
      message: error.message,
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
        id: id,
      },
      data: {
        question,
        answer,
      },
    });

    res.status(200).json({
      success: true,
      data: updatedArticle,
    });
  } catch (error) {
    console.error("Error updating knowledge base article by ID:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update knowledge base article by ID",
      message: error.message,
    });
  }
};

// search knowledge base articles by question
const getResponseFromKnowledgeBase = async (req, res) => {
  try {
    const { question } = req.body;

    // 1. Get embedding from FastAPI server
    const embedRes = await axios.post("http://localhost:8000/embed", {
      text: question,
    });
    const userVector = embedRes.data.embedding;

    // 2. Search best match from Postgres using pgvector
    const bestMatch = await prisma.$queryRawUnsafe(
      `
    SELECT id, question, answer, created_at,
      1 - (vector <#> '[${userVector.join(",")}]') AS similarity
    FROM "KnowldgeBase"
    ORDER BY similarity DESC
    LIMIT 1;
    `
    );

    // 3. Use the answer from the best match only
    const combinedAnswers =
      bestMatch.length > 0 ? bestMatch[0].answer : "No matching article found.";

    // 4. Use your custom LLM (LLaMA) to polish the response
    const API_ENDPOINT = "http://192.168.100.3:1234/v1/chat/completions";
    const llamaResponse = await axios.post(API_ENDPOINT, {
      model: "llama-3.2-1b-instruct",
      messages: [
        {
          role: "system",
          content: `
You are the polite, helpful, and concise AI Assistant for Vicarage Resorts only. You must respond ONLY to questions clearly related to Vicarage Resorts.

Follow these rules very strictly:

1. **Relevant Topics Only**: Only answer if the question is clearly about:
    Rooms, bookings, check-in/out
    Services or amenities (Wi-Fi, parking, restaurant, pets)
    Location, contact info, directions
    Facilities, pricing, or guest policies
    Events or business meetings at Vicarage Resorts

2. **Ignore Unrelated Topics**: If the question is about unrelated things (history, politics, math, tech, general knowledge, etc.), respond ONLY with:
  I'm sorry, I can only help with questions related to Vicarage Resorts.
    I can't assist with that. Please ask about Vicarage Resorts.
    I can only answer questions about Vicarage Resorts.

3. **Greeting Messages**: If the message is a greeting (e.g. "hello", "hi", "good morning"), respond warmly and briefly. Examples:
    Hi there! How can I assist you today?
    Hello! What can I help you with regarding Vicarage Resorts?
    Good morning! How may I assist you with Vicarage Resorts?


3. Yes/No Questions: Answer directly if relevant. For example:
    User: "Is there Wi-Fi?"
     Assistant: Yes, we have free Wi-Fi available.
    User: Are pets allowed?
     Assistant: Yes, small and medium-sized pets are allowed with prior approval.

5. **Yes/No Questions**: Answer directly if relevant. Examples:
    Is there Wi-Fi? : Yes, we have free Wi-Fi.
    Do you allow pets? : Yes, small and medium pets are allowed with prior approval.

6. **Polite and Professional**: Always be polite, professional, and concise. Use friendly language but avoid casual slang or emojis.

7. **Booking Intent**:
   - If the guest wants to book a room, respond with:
   If You would like to book a room at Vicarage Resorts. You can visit our online reservation system at http://localhost:3000/pages/cottages, or contact us directly by phone at 0743 666 333 / 0746 888 333 or by email at info@vicarageresorts.com. Would you like more information about the booking process?

8.**Follow-up YES**:
   - If the guest responds with "yes" or similar after asking to book a room, continue:
     "Great! Here's how to book:
     1. Go to http://localhost:3000/pages/cottages
     2. Select your check-in and check-out dates.
     3. Choose your preferred room type.
     4. Submit your request.

     You’ll receive a confirmation shortly. Call or WhatsApp us if you need help."
    

Always be short, professional, and friendly. Never go off-topic or guess. Do not respond to unrelated questions — even if they seem polite or interesting.
`,
        },
        {
          role: "user",
          content: `User question: "${question}"\n\nAvailable information:\n${combinedAnswers}`,
        },
      ],
      temperature: 0.7,
    });

    const finalAnswer = llamaResponse.data.choices[0].message.content;

    // 5. Return the final polished response
    res.status(200).json({
      success: true,
      answer: finalAnswer,
      //matches: topMatches,
    });
  } catch (error) {
    console.error("❌ Failed to get response:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve answer",
      error: error.message,
    });
  }
};

// Delete a knowledge base article by ID
const deleteKnowledgeBaseArticleById = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedArticle = await prisma.knowldgeBase.delete({
      where: {
        id: id,
      },
    });

    res.status(200).json({
      success: true,
      data: deletedArticle,
    });
  } catch (error) {
    console.error("Error deleting knowledge base article by ID:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete knowledge base article by ID",
      message: error.message,
    });
  }
};

module.exports = {
  getAllKnowledgeBaseArticles,
  getKnowledgeBaseArticleById,
  createKnowledgeBaseArticle,
  updateKnowledgeBaseArticleById,
  deleteKnowledgeBaseArticleById,
  createBulkKnowledgeBaseArticles,
  getResponseFromKnowledgeBase,
};

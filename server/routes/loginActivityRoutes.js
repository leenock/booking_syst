// routes/loginActivityRoutes.js
const express = require("express");
const router = express.Router();

const {
  getRecentLoginAttempts,
  logLoginAttempt,
} = require("../controllers/loginActivityController");

router.get("/", getRecentLoginAttempts); // GET /api/login-activity
router.post("/", logLoginAttempt);       // POST /api/login-activity

module.exports = router;

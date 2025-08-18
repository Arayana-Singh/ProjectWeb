const express = require("express");
const Log = require("../models/Log");
const router = express.Router();

// Create Log
router.post("/", async (req, res) => {
  try {
    const log = new Log(req.body);
    await log.save();
    res.status(201).json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get All Logs
router.get("/", async (req, res) => {
  try {
    const logs = await Log.find().populate("user");
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
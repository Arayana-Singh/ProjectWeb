const express = require("express");
const Team = require("../models/Team");
const router = express.Router();

// Create Team
router.post("/", async (req, res) => {
  try {
    const team = new Team(req.body);
    await team.save();
    res.status(201).json(team);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get All Teams
router.get("/", async (req, res) => {
  try {
    const teams = await Team.find();
    res.json(teams);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
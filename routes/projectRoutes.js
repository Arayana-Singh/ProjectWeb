const express = require("express");
const Team = require("../models/Team");
const router = express.Router();

router.post("/", async (req, res) => {
  const team = new Team({ ...req.body });
  await team.save();
  res.json(team);
});

router.get("/", async (req, res) => {
  const teams = await Team.find().populate("members");
  res.json(teams);
});

module.exports = router;

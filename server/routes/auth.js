const router = require('express').Router();
const Player = require('../models/Player');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const newPlayer = new Player({ username, password: hash });
  await newPlayer.save();
  res.send("Registered");
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const player = await Player.findOne({ username });
  if (!player) return res.status(400).send("User not found");
  const valid = await bcrypt.compare(password, player.password);
  if (!valid) return res.status(401).send("Wrong password");
  const token = jwt.sign({ id: player._id }, process.env.JWT_SECRET);
  res.json({ token });
});

module.exports = router;

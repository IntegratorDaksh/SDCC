// routes/scrim.js (Backend)
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Scrim = require('../models/Scrim');

// Setup multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// POST route to submit a scrim (image upload)
router.post('/submit', upload.single('screenshot'), async (req, res) => {
  try {
    const { player1, player2 } = req.body;
    const screenshot = req.file.filename;

    const newScrim = new Scrim({
      player1,
      player2,
      screenshot,
      status: 'pending' // For admin to review
    });

    await newScrim.save();
    res.status(200).json({ message: 'Scrim submitted successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Error submitting scrim', error: err });
  }
});

// GET route to fetch all pending scrims for admin
router.get('/pending', async (req, res) => {
  try {
    const scrims = await Scrim.find({ status: 'pending' });
    res.status(200).json(scrims);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching scrims', error: err });
  }
});

module.exports = router;

const express = require('express');
const { processOutputController } = require('../controllers/commandController');

const router = express.Router();

// Define route for command processing
router.post('/process', processOutputController);

module.exports = router;

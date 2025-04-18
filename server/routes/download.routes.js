const express = require('express');
const { downloadFileController } = require('../controllers/downloadController');

const router = express.Router();

// Define route for downloading files
router.get('/:filename', downloadFileController);

module.exports = router;

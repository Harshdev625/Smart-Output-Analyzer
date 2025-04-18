const express = require('express');
const { exportDataController } = require('../controllers/exportController');

const router = express.Router();

// Define route for exporting data
router.post('/', exportDataController);

module.exports = router;

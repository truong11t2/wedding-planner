const express = require('express');
const router = express.Router();
const bankController = require('../controllers/bankController');

// GET /api/banks — bank list used by the invitation builder's VietQR selector.
router.get('/', bankController.getBanks);

module.exports = router;

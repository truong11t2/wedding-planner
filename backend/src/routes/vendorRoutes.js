const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');
const { protect } = require('../middleware/authMiddleware');

// Public route - submit vendor contact
router.post('/contact', vendorController.submitVendorContact);

// Admin routes - manage vendor contacts
router.get('/contacts', protect, vendorController.getAllVendorContacts);
router.put('/contacts/:id', protect, vendorController.updateVendorContactStatus);

module.exports = router;

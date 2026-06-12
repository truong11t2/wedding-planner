const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// Submit contact form
router.post('/', contactController.submitContact);

// Admin routes (you may want to add authentication middleware)
router.get('/', contactController.getAllContacts);
router.put('/:id/status', contactController.updateContactStatus);
router.delete('/:id', contactController.deleteContact);

module.exports = router;

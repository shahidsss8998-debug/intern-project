// ================================================
// CONTACT ROUTES
// ================================================
// Defines all contact form-related API endpoints

const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

/**
 * GET /api/contact
 * Get all contact messages
 */
router.get('/', contactController.getAllMessages);

/**
 * GET /api/contact/:id
 * Get contact message by ID
 */
router.get('/:id', contactController.getMessageById);

/**
 * POST /api/contact
 * Submit contact form
 */
router.post('/', contactController.submitContactForm);

/**
 * PUT /api/contact/:id/read
 * Mark message as read
 */
router.put('/:id/read', contactController.markAsRead);

/**
 * DELETE /api/contact/:id
 * Delete contact message
 */
router.delete('/:id', contactController.deleteMessage);

module.exports = router;

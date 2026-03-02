// ================================================
// CONTACT CONTROLLER
// ================================================
// Handles business logic for contact form submissions

const { contactDb } = require('../config/db');

/**
 * Get all contact messages
 * GET /api/contact
 */
exports.getAllMessages = (req, res) => {
    try {
        const messages = contactDb.getAll();
        res.status(200).json({
            success: true,
            data: messages,
            count: messages.length
        });
    } catch (error) {
        console.error('Error fetching contact messages:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching messages',
            error: error.message
        });
    }
};

/**
 * Get contact message by ID
 * GET /api/contact/:id
 */
exports.getMessageById = (req, res) => {
    try {
        const message = contactDb.getById(req.params.id);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Contact message not found'
            });
        }

        res.status(200).json({
            success: true,
            data: message
        });
    } catch (error) {
        console.error('Error fetching contact message:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching message',
            error: error.message
        });
    }
};

/**
 * Submit contact form
 * POST /api/contact
 */
exports.submitContactForm = (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validation
        const errors = [];

        if (!name || name.trim() === '') {
            errors.push('Name is required');
        }

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.push('Valid email address is required');
        }

        if (!subject || subject.trim() === '') {
            errors.push('Subject is required');
        }

        if (subject && subject.length < 3) {
            errors.push('Subject must be at least 3 characters');
        }

        if (subject && subject.length > 200) {
            errors.push('Subject cannot exceed 200 characters');
        }

        if (!message || message.trim() === '') {
            errors.push('Message is required');
        }

        if (message && message.length < 10) {
            errors.push('Message must be at least 10 characters');
        }

        if (message && message.length > 2000) {
            errors.push('Message cannot exceed 2000 characters');
        }

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors
            });
        }

        // Create contact message
        const contactMessage = {
            name: name.trim(),
            email: email.trim(),
            subject: subject.trim(),
            message: message.trim()
        };

        // Save to database
        const savedMessage = contactDb.create(contactMessage);

        // In a real application, you would send an email here
        console.log('✓ Contact message received from:', savedMessage.email);

        res.status(201).json({
            success: true,
            message: 'Your message has been received. We will contact you shortly.',
            data: {
                id: savedMessage.id,
                email: savedMessage.email
            }
        });
    } catch (error) {
        console.error('Error submitting contact form:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting contact form',
            error: error.message
        });
    }
};

/**
 * Mark message as read
 * PUT /api/contact/:id/read
 */
exports.markAsRead = (req, res) => {
    try {
        const message = contactDb.getById(req.params.id);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Contact message not found'
            });
        }

        const updatedMessage = contactDb.markAsRead(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Message marked as read',
            data: updatedMessage
        });
    } catch (error) {
        console.error('Error marking message as read:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating message',
            error: error.message
        });
    }
};

/**
 * Delete contact message
 * DELETE /api/contact/:id
 */
exports.deleteMessage = (req, res) => {
    try {
        const message = contactDb.getById(req.params.id);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Contact message not found'
            });
        }

        contactDb.delete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Contact message deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting contact message:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting message',
            error: error.message
        });
    }
};

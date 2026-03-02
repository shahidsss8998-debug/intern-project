// ================================================
// RESERVATION CONTROLLER
// ================================================
// Handles business logic for reservation operations

const { reservationDb } = require('../config/db');
const Reservation = require('../models/Reservation');

/**
 * Get all reservations
 * GET /api/reservations
 */
exports.getAllReservations = (req, res) => {
    try {
        const reservations = reservationDb.getAll();
        res.status(200).json({
            success: true,
            data: reservations,
            count: reservations.length
        });
    } catch (error) {
        console.error('Error fetching reservations:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching reservations',
            error: error.message
        });
    }
};

/**
 * Get reservation by ID
 * GET /api/reservations/:id
 */
exports.getReservationById = (req, res) => {
    try {
        const reservation = reservationDb.getById(req.params.id);

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: 'Reservation not found'
            });
        }

        res.status(200).json({
            success: true,
            data: reservation
        });
    } catch (error) {
        console.error('Error fetching reservation:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching reservation',
            error: error.message
        });
    }
};

/**
 * Get reservations by email
 * GET /api/reservations/email/:email
 */
exports.getReservationsByEmail = (req, res) => {
    try {
        const reservations = reservationDb.getByEmail(req.params.email);

        res.status(200).json({
            success: true,
            email: req.params.email,
            data: reservations,
            count: reservations.length
        });
    } catch (error) {
        console.error('Error fetching reservations by email:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching reservations',
            error: error.message
        });
    }
};

/**
 * Create new reservation
 * POST /api/reservations
 */
exports.createReservation = (req, res) => {
    try {
        const { name, email, phone, guests, date, time, occasion, special_requests } = req.body;

        // Create new reservation instance
        const reservation = new Reservation(
            name,
            email,
            phone,
            guests,
            date,
            time,
            occasion,
            special_requests
        );

        // Validate reservation
        const validation = reservation.validate();
        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validation.errors
            });
        }

        // Save to database
        const savedReservation = reservationDb.create(reservation.toJSON());

        // Send verification email to specified address
        const { sendReservationVerification } = require('../utils/mailer');
        const verifyEmail = 'shahidss8998@gmail.com';
        const subject = `Reservation Verification: ${name} for ${date} at ${time}`;
        const html = `
            <h2>Reservation Verification Needed</h2>
            <ul>
                <li><b>Name:</b> ${name}</li>
                <li><b>Email:</b> ${email}</li>
                <li><b>Phone:</b> ${phone}</li>
                <li><b>Guests:</b> ${guests}</li>
                <li><b>Date:</b> ${date}</li>
                <li><b>Time:</b> ${time}</li>
                <li><b>Occasion:</b> ${occasion || 'N/A'}</li>
                <li><b>Special Requests:</b> ${special_requests || 'N/A'}</li>
            </ul>
            <p>Reservation ID: <b>${savedReservation.id}</b></p>
        `;
        sendReservationVerification(verifyEmail, subject, html)
            .then(() => {
                res.status(201).json({
                    success: true,
                    message: 'Reservation created and verification email sent',
                    data: savedReservation,
                    confirmationNumber: savedReservation.id
                });
            })
            .catch((err) => {
                console.error('Error sending verification email:', err);
                res.status(201).json({
                    success: true,
                    message: 'Reservation created, but failed to send verification email',
                    data: savedReservation,
                    confirmationNumber: savedReservation.id,
                    emailError: err.message
                });
            });
    } catch (error) {
        console.error('Error creating reservation:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating reservation',
            error: error.message
        });
    }
};

/**
 * Update reservation
 * PUT /api/reservations/:id
 */
exports.updateReservation = (req, res) => {
    try {
        const { name, email, phone, guests, date, time, occasion, special_requests, status } = req.body;

        // Check if reservation exists
        const existingReservation = reservationDb.getById(req.params.id);
        if (!existingReservation) {
            return res.status(404).json({
                success: false,
                message: 'Reservation not found'
            });
        }

        // Create updated reservation and validate
        const reservation = new Reservation(
            name || existingReservation.name,
            email || existingReservation.email,
            phone || existingReservation.phone,
            guests || existingReservation.guests,
            date || existingReservation.date,
            time || existingReservation.time,
            occasion || existingReservation.occasion,
            special_requests !== undefined ? special_requests : existingReservation.special_requests
        );

        const validation = reservation.validate();
        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validation.errors
            });
        }

        // Update in database
        const updateData = reservation.toJSON();
        if (status) updateData.status = status; // Allow status update without validation

        const updatedReservation = reservationDb.update(req.params.id, updateData);

        res.status(200).json({
            success: true,
            message: 'Reservation updated successfully',
            data: updatedReservation
        });
    } catch (error) {
        console.error('Error updating reservation:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating reservation',
            error: error.message
        });
    }
};

/**
 * Cancel reservation
 * DELETE /api/reservations/:id
 */
exports.cancelReservation = (req, res) => {
    try {
        // Check if reservation exists
        const existingReservation = reservationDb.getById(req.params.id);
        if (!existingReservation) {
            return res.status(404).json({
                success: false,
                message: 'Reservation not found'
            });
        }

        // Delete from database
        reservationDb.delete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Reservation cancelled successfully'
        });
    } catch (error) {
        console.error('Error cancelling reservation:', error);
        res.status(500).json({
            success: false,
            message: 'Error cancelling reservation',
            error: error.message
        });
    }
};

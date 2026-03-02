// ================================================
// RESERVATION ROUTES
// ================================================
// Defines all reservation-related API endpoints

const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

/**
 * GET /api/reservations
 * Get all reservations
 */
router.get('/', reservationController.getAllReservations);

/**
 * GET /api/reservations/:id
 * Get reservation by ID
 */
router.get('/:id', reservationController.getReservationById);

/**
 * GET /api/reservations/email/:email
 * Get reservations by email
 */
router.get('/email/:email', reservationController.getReservationsByEmail);

/**
 * POST /api/reservations
 * Create new reservation
 */
router.post('/', reservationController.createReservation);

/**
 * PUT /api/reservations/:id
 * Update reservation
 */
router.put('/:id', reservationController.updateReservation);

/**
 * DELETE /api/reservations/:id
 * Cancel reservation
 */
router.delete('/:id', reservationController.cancelReservation);

module.exports = router;

// ================================================
// SPOONFUL - EXPRESS SERVER
// ================================================
// Main backend server file for the restaurant API

const express = require('express');
const cors = require('cors');
const path = require('path');

// Import database initialization
const { initializeDatabase } = require('./config/db');

// Import routes
const menuRoutes = require('./routes/menuRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const contactRoutes = require('./routes/contactRoutes');
const cartRoutes = require('./routes/cartRoutes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// ================================================
// MIDDLEWARE
// ================================================

// Enable CORS for all routes (allows frontend to communicate with backend)
app.use(cors({
    origin: '*', // In production, specify your frontend domain
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files so uploaded QR images can be served from /images
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Request logging middleware
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
    next();
});

// ================================================
// ROUTES
// ================================================

/**
 * Health check endpoint
 * GET /api/health
 */
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Spoonful API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

/**
 * API Information endpoint
 * GET /api
 */
app.get('/api', (req, res) => {
    res.status(200).json({
        success: true,
        name: 'Spoonful Restaurant API',
        version: '1.0.0',
        description: 'REST API for restaurant menu, reservations, and contact management',
        endpoints: {
            menu: '/api/menu',
            reservations: '/api/reservations',
            contact: '/api/contact',
            health: '/api/health'
        }
    });
});

/**
 * Menu routes
 * GET, POST /api/menu
 * GET, PUT, DELETE /api/menu/:id
 * GET /api/menu/category/:category
 */
app.use('/api/menu', menuRoutes);

/**
 * Reservation routes
 * GET, POST /api/reservations
 * GET, PUT, DELETE /api/reservations/:id
 * GET /api/reservations/email/:email
 */
app.use('/api/reservations', reservationRoutes);

/**
 * Contact routes
 * GET, POST /api/contact
 * GET, PUT, DELETE /api/contact/:id
 */
app.use('/api/contact', contactRoutes);

/**
 * Cart routes
 * GET /api/cart
 * POST /api/cart/add
 * PUT /api/cart/update
 * DELETE /api/cart/remove/:dishId
 * DELETE /api/cart/clear
 * POST /api/cart/checkout
 */
app.use('/api/cart', cartRoutes);

// ================================================
// 404 HANDLER
// ================================================
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found',
        path: req.path,
        method: req.method
    });
});

// ================================================
// ERROR HANDLING MIDDLEWARE
// ================================================
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// ================================================
// START SERVER
// ================================================
app.listen(PORT, () => {
    console.log('');
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║      🍽️  SPOONFUL - BACKEND SERVER              ║');
    console.log('╚════════════════════════════════════════════════════════╝');
    console.log('');
    console.log(`✓ Server is running on http://localhost:${PORT}`);
    console.log(`✓ API Base URL: http://localhost:${PORT}/api`);
    console.log('');
    console.log('Available Endpoints:');
    console.log('  - GET  /api              → API Information');
    console.log('  - GET  /api/health       → Health Check');
    console.log('  - GET  /api/menu         → Get all menu items');
    console.log('  - POST /api/menu         → Create menu item');
    console.log('  - GET  /api/reservations → Get all reservations');
    console.log('  - POST /api/reservations → Create reservation');
    console.log('  - GET  /api/contact      → Get all messages');
    console.log('  - POST /api/contact      → Submit contact form');
    console.log('');
    console.log('Press Ctrl+C to stop the server');
    console.log('');

    // Initialize database
    initializeDatabase();
});

module.exports = app;

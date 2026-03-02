// ================================================
// CART ROUTES
// ================================================
// Handles shopping cart operations: add, remove, view, checkout

const express = require('express');
const path = require('path');
const router = express.Router();

// In-memory cart storage (in production, use database)
const cartStorage = new Map();
// Persistent-ish in-memory orders storage for demo/payment confirmation
const ordersStorage = new Map();
// UPI payment configuration (merchant sets UPI number and QR URL)
// Default UPI config — set merchant UPI ID to provided value and allow QR to be uploaded
let upiConfig = { upiNumber: '7592037434@fam', qrUrl: null }; 

// Generate unique session/customer ID
function getSessionId(req) {
    return req.ip || 'anonymous';
}

// ================================================
// GET /api/cart - Retrieve user's cart
// ================================================
router.get('/', (req, res) => {
    try {
        const sessionId = getSessionId(req);
        const cart = cartStorage.get(sessionId) || { items: [], total: 0 };
        
        res.status(200).json({
            success: true,
            message: 'Cart retrieved successfully',
            data: cart
        });
    } catch (error) {
        console.error('Error retrieving cart:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving cart',
            error: error.message
        });
    }
});

// ================================================
// POST /api/cart/add - Add item to cart
// ================================================
router.post('/add', (req, res) => {
    try {
        const { dishId, dishName, price, quantity, image } = req.body;
        
        // Validate input
        if (!dishId || !dishName || !price || !quantity) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: dishId, dishName, price, quantity'
            });
        }
        
        if (quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Quantity must be greater than 0'
            });
        }
        
        const sessionId = getSessionId(req);
        let cart = cartStorage.get(sessionId) || { items: [], total: 0 };
        
        // Check if item already exists in cart
        const existingItem = cart.items.find(item => item.dishId === dishId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.subtotal = existingItem.quantity * existingItem.price;
        } else {
            cart.items.push({
                dishId,
                dishName,
                price,
                quantity,
                image,
                subtotal: price * quantity
            });
        }
        
        // Calculate total
        cart.total = cart.items.reduce((sum, item) => sum + item.subtotal, 0);
        
        cartStorage.set(sessionId, cart);
        
        res.status(200).json({
            success: true,
            message: 'Item added to cart successfully',
            data: cart
        });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding item to cart',
            error: error.message
        });
    }
});

// ================================================
// PUT /api/cart/update - Update item quantity in cart
// ================================================
router.put('/update', (req, res) => {
    try {
        const { dishId, quantity } = req.body;
        
        if (!dishId || quantity === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: dishId, quantity'
            });
        }
        
        const sessionId = getSessionId(req);
        let cart = cartStorage.get(sessionId);
        
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }
        
        if (quantity <= 0) {
            // Remove item if quantity is 0 or less
            cart.items = cart.items.filter(item => item.dishId !== dishId);
        } else {
            const item = cart.items.find(item => item.dishId === dishId);
            if (item) {
                item.quantity = quantity;
                item.subtotal = item.quantity * item.price;
            }
        }
        
        // Recalculate total
        cart.total = cart.items.reduce((sum, item) => sum + item.subtotal, 0);
        
        cartStorage.set(sessionId, cart);
        
        res.status(200).json({
            success: true,
            message: 'Cart updated successfully',
            data: cart
        });
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating cart',
            error: error.message
        });
    }
});

// ================================================
// DELETE /api/cart/remove/:dishId - Remove item from cart
// ================================================
router.delete('/remove/:dishId', (req, res) => {
    try {
        const { dishId } = req.params;
        const sessionId = getSessionId(req);
        let cart = cartStorage.get(sessionId);
        
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }
        
        const initialLength = cart.items.length;
        cart.items = cart.items.filter(item => item.dishId !== parseInt(dishId));
        
        if (cart.items.length === initialLength) {
            return res.status(404).json({
                success: false,
                message: 'Item not found in cart'
            });
        }
        
        // Recalculate total
        cart.total = cart.items.reduce((sum, item) => sum + item.subtotal, 0);
        
        cartStorage.set(sessionId, cart);
        
        res.status(200).json({
            success: true,
            message: 'Item removed from cart successfully',
            data: cart
        });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({
            success: false,
            message: 'Error removing item from cart',
            error: error.message
        });
    }
});

// ================================================
// DELETE /api/cart/clear - Clear entire cart
// ================================================
router.delete('/clear', (req, res) => {
    try {
        const sessionId = getSessionId(req);
        cartStorage.delete(sessionId);
        
        res.status(200).json({
            success: true,
            message: 'Cart cleared successfully',
            data: { items: [], total: 0 }
        });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({
            success: false,
            message: 'Error clearing cart',
            error: error.message
        });
    }
});

// ================================================
// POST /api/cart/checkout - Process order from cart
// ================================================
router.post('/checkout', (req, res) => {
    try {
        const { customerName, customerEmail, customerPhone, deliveryAddress, paymentMethod } = req.body;
        const sessionId = getSessionId(req);
        let cart = cartStorage.get(sessionId);

        // If server cart is missing or empty, accept client-sent cart (from localStorage fallback)
        if ((!cart || cart.items.length === 0) && req.body && Array.isArray(req.body.items) && req.body.items.length > 0) {
            cart = { items: req.body.items, total: req.body.total || req.body.items.reduce((s,i) => s + (i.subtotal || (i.price * (i.quantity || 1))), 0) };
        }

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Cart is empty'
            });
        }

        if (!customerName || !customerEmail || !customerPhone) {
            return res.status(400).json({
                success: false,
                message: 'Missing customer information'
            });
        }

        // Validate payment method
        const validPaymentMethods = ['card', 'upi', 'cash', 'netbanking'];
        if (!paymentMethod || !validPaymentMethods.includes(paymentMethod)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or missing payment method'
            });
        }

        // Calculate totals
        const subtotal = cart.total;
        const tax = Math.round(subtotal * 0.18); // 18% GST
        const total = subtotal + tax;

        // Create order object
        const order = {
            orderId: 'ORD-' + Date.now(),
            timestamp: new Date().toISOString(),
            customer: {
                name: customerName,
                email: customerEmail,
                phone: customerPhone,
                deliveryAddress: deliveryAddress || 'Not specified'
            },
            items: cart.items,
            pricing: {
                subtotal: subtotal,
                tax: tax,
                total: total
            },
            payment: {
                method: paymentMethod,
                // UPI payments require customer to actually pay via their UPI app; mark as pending until confirmed
                status: paymentMethod === 'cash' ? 'pending' : (paymentMethod === 'upi' ? 'pending' : 'completed'),
                transactionId: paymentMethod === 'upi' ? null : (paymentMethod !== 'cash' ? 'TXN-' + Date.now() : null),
                instructions: paymentMethod === 'upi' ? upiConfig : null
            },
            status: paymentMethod === 'upi' ? 'awaiting_payment' : 'confirmed',
            estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000).toISOString() // 45 minutes from now
        };

        // Simulate payment processing for non-cash methods
        if (paymentMethod !== 'cash' && paymentMethod !== 'upi') {
            // In a real application, you would integrate with payment gateways here
            console.log(`Processing ${paymentMethod} payment for order ${order.orderId}`);
        }

        // Save order so merchant can confirm UPI transactions later
        ordersStorage.set(order.orderId, order);

        // Clear cart after checkout initiation
        cartStorage.delete(sessionId);

        res.status(200).json({
            success: true,
            message: 'Order placed successfully',
            data: order
        });
    } catch (error) {
        console.error('Error processing checkout:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing order',
            error: error.message
        });
    }
});

// ================================================
// UPI Configuration & Payment Confirmation Endpoints
// (Simple in-memory endpoints for merchant to set UPI details and to confirm payments)
// ================================================

// GET /api/cart/upi - retrieve current UPI configuration
router.get('/upi', (req, res) => {
    res.status(200).json({ success: true, data: upiConfig });
});

// POST /api/cart/upi - set merchant UPI number and QR URL
router.post('/upi', (req, res) => {
    const { upiNumber, qrUrl } = req.body;
    if (!upiNumber) {
        return res.status(400).json({ success: false, message: 'Missing upiNumber' });
    }

    upiConfig = { upiNumber: upiNumber.trim(), qrUrl: qrUrl ? qrUrl.trim() : null };

    res.status(200).json({ success: true, message: 'UPI configuration saved', data: upiConfig });
});

// POST /api/cart/upload-qr - upload QR image (multipart/form-data 'qrImage')
// Saves file to frontend/images and sets upiConfig.qrUrl so frontend can load it
const multer = require('multer');
const fs = require('fs');
const uploadDir = path.join(__dirname, '..', '..', 'frontend', 'images');
// Ensure images directory exists
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Normalize to a fixed filename to keep references simple
        const ext = path.extname(file.originalname) || '.png';
        cb(null, 'upi-qr' + ext);
    }
});

const upload = multer({ storage });

// If a local upi-qr file exists already in frontend/images, use it as default
const fallbackQr = ['Screenshot_2026131_154509_FamApp.jpg', 'upi-qr.png', 'upi-qr.jpg', 'upi-qr.jpeg']
    .map(n => path.join(uploadDir, n))
    .find(p => fs.existsSync(p));
if (fallbackQr) {
    upiConfig.qrUrl = '/images/' + path.basename(fallbackQr);
}

router.post('/upload-qr', upload.single('qrImage'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        // Set the public URL to the saved file relative to frontend root
        const filename = req.file.filename;
        upiConfig.qrUrl = `/images/${filename}`;

        res.status(200).json({ success: true, message: 'QR uploaded', data: { qrUrl: upiConfig.qrUrl } });
    } catch (err) {
        console.error('Error uploading QR:', err);
        res.status(500).json({ success: false, message: 'Error uploading file', error: err.message });
    }
});

// POST /api/cart/confirm - merchant or customer can confirm a UPI payment by submitting orderId and transactionId
router.post('/confirm', (req, res) => {
    const { orderId, transactionId } = req.body;
    if (!orderId || !transactionId) {
        return res.status(400).json({ success: false, message: 'Missing orderId or transactionId' });
    }

    const order = ordersStorage.get(orderId);
    if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.payment.method !== 'upi') {
        return res.status(400).json({ success: false, message: 'Order payment method is not UPI' });
    }

    if (order.payment.status === 'completed') {
        return res.status(400).json({ success: false, message: 'Payment already confirmed' });
    }

    order.payment.transactionId = transactionId;
    order.payment.status = 'completed';
    order.status = 'confirmed';

    ordersStorage.set(orderId, order);

    res.status(200).json({ success: true, message: 'Payment confirmed', data: order });
});

module.exports = router;

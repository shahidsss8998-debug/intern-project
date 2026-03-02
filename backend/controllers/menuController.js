// ================================================
// MENU CONTROLLER
// ================================================
// Handles business logic for menu operations

const { menuDb } = require('../config/db');
const MenuItem = require('../models/Menu');

/**
 * Get all menu items
 * GET /api/menu
 */
exports.getAllMenuItems = (req, res) => {
    try {
        const items = menuDb.getAll();
        res.status(200).json({
            success: true,
            data: items,
            count: items.length
        });
    } catch (error) {
        console.error('Error fetching menu items:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching menu items',
            error: error.message
        });
    }
};

/**
 * Get menu items by category
 * GET /api/menu/category/:category
 */
exports.getMenuByCategory = (req, res) => {
    try {
        const category = req.params.category.toLowerCase();

        // Validate category
        const validCategories = ['appetizer', 'main', 'dessert', 'beverage'];
        if (!validCategories.includes(category)) {
            return res.status(400).json({
                success: false,
                message: `Invalid category. Must be one of: ${validCategories.join(', ')}`
            });
        }

        const items = menuDb.getByCategory(category);
        res.status(200).json({
            success: true,
            category: category,
            data: items,
            count: items.length
        });
    } catch (error) {
        console.error('Error fetching menu by category:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching menu items',
            error: error.message
        });
    }
};

/**
 * Get single menu item by ID
 * GET /api/menu/:id
 */
exports.getMenuItemById = (req, res) => {
    try {
        const item = menuDb.getById(req.params.id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }

        res.status(200).json({
            success: true,
            data: item
        });
    } catch (error) {
        console.error('Error fetching menu item:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching menu item',
            error: error.message
        });
    }
};

/**
 * Create new menu item
 * POST /api/menu
 */
exports.createMenuItem = (req, res) => {
    try {
        const { name, category, price, description } = req.body;

        // Create new menu item instance
        const menuItem = new MenuItem(name, category, price, description);

        // Validate menu item
        const validation = menuItem.validate();
        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validation.errors
            });
        }

        // Save to database
        const savedItem = menuDb.create(menuItem.toJSON());

        res.status(201).json({
            success: true,
            message: 'Menu item created successfully',
            data: savedItem
        });
    } catch (error) {
        console.error('Error creating menu item:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating menu item',
            error: error.message
        });
    }
};

/**
 * Update menu item
 * PUT /api/menu/:id
 */
exports.updateMenuItem = (req, res) => {
    try {
        const { name, category, price, description } = req.body;

        // Validate that at least one field is provided
        if (!name && !category && !price && !description) {
            return res.status(400).json({
                success: false,
                message: 'At least one field must be provided for update'
            });
        }

        // Check if item exists
        const existingItem = menuDb.getById(req.params.id);
        if (!existingItem) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }

        // Create updated item and validate
        const menuItem = new MenuItem(
            name || existingItem.name,
            category || existingItem.category,
            price || existingItem.price,
            description || existingItem.description
        );

        const validation = menuItem.validate();
        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validation.errors
            });
        }

        // Update in database
        const updatedItem = menuDb.update(req.params.id, menuItem.toJSON());

        res.status(200).json({
            success: true,
            message: 'Menu item updated successfully',
            data: updatedItem
        });
    } catch (error) {
        console.error('Error updating menu item:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating menu item',
            error: error.message
        });
    }
};

/**
 * Delete menu item
 * DELETE /api/menu/:id
 */
exports.deleteMenuItem = (req, res) => {
    try {
        // Check if item exists
        const existingItem = menuDb.getById(req.params.id);
        if (!existingItem) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }

        // Delete from database
        menuDb.delete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Menu item deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting menu item:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting menu item',
            error: error.message
        });
    }
};

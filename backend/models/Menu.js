// ================================================
// MENU MODEL
// ================================================
// Defines the structure and validation for menu items

/**
 * Menu Item Model
 * Represents a single menu item in the restaurant
 */
class MenuItem {
    constructor(name, category, price, description) {
        this.name = name;
        this.category = category; // 'appetizer', 'main', 'dessert', 'beverage'
        this.price = price;
        this.description = description;
    }

    /**
     * Validate menu item data
     * @returns {object} Validation result with isValid boolean and errors array
     */
    validate() {
        const errors = [];

        // Validate name
        if (!this.name || this.name.trim() === '') {
            errors.push('Menu item name is required');
        }

        if (this.name && this.name.length < 3) {
            errors.push('Menu item name must be at least 3 characters');
        }

        if (this.name && this.name.length > 100) {
            errors.push('Menu item name cannot exceed 100 characters');
        }

        // Validate category
        const validCategories = ['appetizer', 'main', 'dessert', 'beverage'];
        if (!validCategories.includes(this.category)) {
            errors.push(`Category must be one of: ${validCategories.join(', ')}`);
        }

        // Validate price
        if (!this.price || this.price <= 0) {
            errors.push('Price must be a positive number');
        }

        if (this.price && this.price > 1000) {
            errors.push('Price seems unreasonably high');
        }

        // Validate description
        if (!this.description || this.description.trim() === '') {
            errors.push('Menu item description is required');
        }

        if (this.description && this.description.length < 10) {
            errors.push('Description must be at least 10 characters');
        }

        if (this.description && this.description.length > 500) {
            errors.push('Description cannot exceed 500 characters');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Convert menu item to JSON
     * @returns {object} JSON representation of menu item
     */
    toJSON() {
        return {
            name: this.name,
            category: this.category,
            price: parseFloat(this.price).toFixed(2),
            description: this.description
        };
    }
}

module.exports = MenuItem;

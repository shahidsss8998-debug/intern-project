// ================================================
// SPOONFUL - DATABASE CONFIGURATION
// ================================================
// This file handles the data storage layer
// Currently using JSON file storage for simplicity
// Can be easily replaced with MongoDB or MySQL

const fs = require('fs');
const path = require('path');

// Data directory paths
const DATA_DIR = path.join(__dirname, '..', 'data');
const MENU_FILE = path.join(DATA_DIR, 'menu.json');
const RESERVATIONS_FILE = path.join(DATA_DIR, 'reservations.json');
const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.json');

/**
 * Initialize data directory and files if they don't exist
 */
function initializeDatabase() {
    // Create data directory if it doesn't exist
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    // Initialize menu.json with dummy data
    if (!fs.existsSync(MENU_FILE)) {
        const dummyMenu = [
            {
                id: 1,
                name: 'Grilled Salmon',
                category: 'main',
                price: 24.99,
                description: 'Atlantic salmon fillet with lemon butter sauce and seasonal vegetables'
            },
            {
                id: 2,
                name: 'Beef Tenderloin',
                category: 'main',
                price: 32.99,
                description: 'Premium cut aged beef with truffle mashed potatoes and red wine reduction'
            },
            {
                id: 3,
                name: 'Lobster Risotto',
                category: 'main',
                price: 28.99,
                description: 'Creamy arborio rice with fresh lobster, white wine, and parmesan'
            },
            {
                id: 4,
                name: 'French Onion Soup',
                category: 'appetizer',
                price: 8.99,
                description: 'Caramelized onions, beef broth, toasted bread and melted gruyere cheese'
            },
            {
                id: 5,
                name: 'Oysters Rockefeller',
                category: 'appetizer',
                price: 12.99,
                description: 'Fresh oysters topped with herbs butter and baked to perfection'
            },
            {
                id: 6,
                name: 'Foie Gras Terrine',
                category: 'appetizer',
                price: 16.99,
                description: 'Silky smooth foie gras with brioche toast and fig compote'
            },
            {
                id: 7,
                name: 'Chocolate Lava Cake',
                category: 'dessert',
                price: 8.99,
                description: 'Warm chocolate cake with molten center, vanilla ice cream and raspberry sauce'
            },
            {
                id: 8,
                name: 'Crème Brûlée',
                category: 'dessert',
                price: 7.99,
                description: 'Classic vanilla custard with caramelized sugar crust'
            },
            {
                id: 9,
                name: 'Tiramisu',
                category: 'dessert',
                price: 6.99,
                description: 'Traditional Italian dessert with mascarpone, espresso and cocoa'
            },
            {
                id: 10,
                name: 'Espresso',
                category: 'beverage',
                price: 2.99,
                description: 'Rich, concentrated coffee shot'
            },
            {
                id: 11,
                name: 'House Wine Selection',
                category: 'beverage',
                price: 6.99,
                description: 'Selection of fine wines from around the world'
            },
            {
                id: 12,
                name: 'Champagne Cocktail',
                category: 'beverage',
                price: 12.99,
                description: 'Champagne with fresh fruit and liqueur'
            }
        ];
        fs.writeFileSync(MENU_FILE, JSON.stringify(dummyMenu, null, 2));
    }

    // Initialize reservations.json
    if (!fs.existsSync(RESERVATIONS_FILE)) {
        fs.writeFileSync(RESERVATIONS_FILE, JSON.stringify([], null, 2));
    }

    // Initialize contacts.json
    if (!fs.existsSync(CONTACTS_FILE)) {
        fs.writeFileSync(CONTACTS_FILE, JSON.stringify([], null, 2));
    }

    console.log('✓ Database initialized');
}

/**
 * Read data from JSON file
 * @param {string} filePath - Path to the JSON file
 * @returns {array} Data from the file
 */
function readFile(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error);
        return [];
    }
}

/**
 * Write data to JSON file
 * @param {string} filePath - Path to the JSON file
 * @param {array} data - Data to write
 */
function writeFile(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error(`Error writing file ${filePath}:`, error);
    }
}

/**
 * Database operations for menu
 */
const menuDb = {
    getAll: () => readFile(MENU_FILE),
    getById: (id) => {
        const menu = readFile(MENU_FILE);
        return menu.find(item => item.id === parseInt(id));
    },
    getByCategory: (category) => {
        const menu = readFile(MENU_FILE);
        return menu.filter(item => item.category === category);
    },
    create: (item) => {
        const menu = readFile(MENU_FILE);
        item.id = menu.length > 0 ? Math.max(...menu.map(m => m.id)) + 1 : 1;
        menu.push(item);
        writeFile(MENU_FILE, menu);
        return item;
    },
    update: (id, item) => {
        const menu = readFile(MENU_FILE);
        const index = menu.findIndex(m => m.id === parseInt(id));
        if (index !== -1) {
            menu[index] = { ...menu[index], ...item, id: parseInt(id) };
            writeFile(MENU_FILE, menu);
            return menu[index];
        }
        return null;
    },
    delete: (id) => {
        const menu = readFile(MENU_FILE);
        const index = menu.findIndex(m => m.id === parseInt(id));
        if (index !== -1) {
            menu.splice(index, 1);
            writeFile(MENU_FILE, menu);
            return true;
        }
        return false;
    }
};

/**
 * Database operations for reservations
 */
const reservationDb = {
    getAll: () => readFile(RESERVATIONS_FILE),
    getById: (id) => {
        const reservations = readFile(RESERVATIONS_FILE);
        return reservations.find(r => r.id === id);
    },
    create: (reservation) => {
        const reservations = readFile(RESERVATIONS_FILE);
        const { v4: uuidv4 } = require('uuid');
        reservation.id = uuidv4();
        reservation.created_at = new Date().toISOString();
        reservation.status = 'confirmed';
        reservations.push(reservation);
        writeFile(RESERVATIONS_FILE, reservations);
        return reservation;
    },
    update: (id, reservation) => {
        const reservations = readFile(RESERVATIONS_FILE);
        const index = reservations.findIndex(r => r.id === id);
        if (index !== -1) {
            reservations[index] = { ...reservations[index], ...reservation };
            writeFile(RESERVATIONS_FILE, reservations);
            return reservations[index];
        }
        return null;
    },
    delete: (id) => {
        const reservations = readFile(RESERVATIONS_FILE);
        const index = reservations.findIndex(r => r.id === id);
        if (index !== -1) {
            reservations.splice(index, 1);
            writeFile(RESERVATIONS_FILE, reservations);
            return true;
        }
        return false;
    },
    getByEmail: (email) => {
        const reservations = readFile(RESERVATIONS_FILE);
        return reservations.filter(r => r.email === email);
    }
};

/**
 * Database operations for contact messages
 */
const contactDb = {
    getAll: () => readFile(CONTACTS_FILE),
    getById: (id) => {
        const contacts = readFile(CONTACTS_FILE);
        return contacts.find(c => c.id === id);
    },
    create: (contact) => {
        const contacts = readFile(CONTACTS_FILE);
        const { v4: uuidv4 } = require('uuid');
        contact.id = uuidv4();
        contact.created_at = new Date().toISOString();
        contact.read = false;
        contacts.push(contact);
        writeFile(CONTACTS_FILE, contacts);
        return contact;
    },
    markAsRead: (id) => {
        const contacts = readFile(CONTACTS_FILE);
        const index = contacts.findIndex(c => c.id === id);
        if (index !== -1) {
            contacts[index].read = true;
            writeFile(CONTACTS_FILE, contacts);
            return contacts[index];
        }
        return null;
    },
    delete: (id) => {
        const contacts = readFile(CONTACTS_FILE);
        const index = contacts.findIndex(c => c.id === id);
        if (index !== -1) {
            contacts.splice(index, 1);
            writeFile(CONTACTS_FILE, contacts);
            return true;
        }
        return false;
    }
};

module.exports = {
    initializeDatabase,
    menuDb,
    reservationDb,
    contactDb
};

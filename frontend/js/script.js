// --- 3D/2D Table Selection Sync ---
// Global sync function for 3D/2D table selection
window.syncTableSelection = function(tableId, from3D = false) {
    // Sync 2D map
    if (typeof selectTable === 'function') selectTable(tableId);
    // Sync 3D map
    if (window._restaurant3DMapSync && typeof window._restaurant3DMapSync === 'function') {
        window._restaurant3DMapSync(tableId, from3D);
    }
};
// ========================================
// SPOONFUL - MAIN JAVASCRIPT FILE
// ========================================

// Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// Conversion rate: 1 USD = 83 INR (approximate)
const USD_TO_INR = 83;

// Luxury Featured Dishes for Homepage
const FEATURED_DISHES = [
    {
        id: 101,
        name: 'Truffle-Infused Lobster Tail',
        category: 'appetizer',
        price: 2800,
        description: 'Premium lobster tail with black truffle oil, caviar, and champagne reduction',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKv9NFJ87t8y9k7ebl3Rhq-HoWUYKBVwwu1g&s'
    },
    { 
        id: 102,
        name: 'Kobe Beef Ribeye',
        category: 'main',
        price: 3500,
        description: 'Japanese A5 Kobe beef with saffron risotto and truffle jus',
        image: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=500&h=400&fit=crop'
    },
    {
        id: 103,
        name: 'Black Truffle Risotto',
        category: 'main',
        price: 2650,
        description: 'Creamy arborio rice infused with black truffle, wild mushrooms, parmesan, and truffle shavings',
        image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&h=400&fit=crop'
    },
    {
        id: 104,
        name: 'Wagyu Steak Premium',
        category: 'main',
        price: 4200,
        description: 'Prime Japanese Wagyu with Asian pear glaze, truffle sauce, and roasted vegetables',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=400&fit=crop'
    }
];

// Sample Menu Data in Indian Rupees
const DUMMY_MENU = [
    {
        id: 1,
        name: 'Grilled Salmon',
        category: 'main',
        price: 2070,
        description: 'Atlantic salmon fillet with lemon butter sauce and seasonal vegetables',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=400&fit=crop'
    },
    {
        id: 2,
        name: 'Beef Tenderloin',
        category: 'main',
        price: 2738,
        description: 'Premium cut aged beef with truffle mashed potatoes and red wine reduction',
        image: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=500&h=400&fit=crop'
    },
    {
        id: 3,
        name: 'Pan-Seared Dover Sole',
        category: 'main',
        price: 2750,
        description: 'Delicate Dover sole meunière with brown butter, capers, and lemon beurre blanc',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=400&fit=crop'
    },
    {
        id: 4,
        name: 'French Onion Soup',
        category: 'appetizer',
        price: 747,
        description: 'Caramelized onions, beef broth, toasted bread and melted gruyere cheese',
        image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&h=400&fit=crop'
    },
    {
        id: 5,
        name: 'Grilled Oysters with Caviar',
        category: 'appetizer',
        price: 1645,
        description: 'Fresh oysters grilled with garlic butter, topped with premium Beluga caviar and microgreens',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4BlbEM9MslHhIOghEmwP3oTZrPPREPK7fuw&s'
    },
    {
        id: 6,
        name: 'Foie Gras Parfait',
        category: 'appetizer',
        price: 1895,
        description: 'Silky foie gras parfait with aspic gelée, toasted brioche, and aged balsamic',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=400&fit=crop'
    },
    {
        id: 7,
        name: 'Chocolate Lava Cake',
        category: 'dessert',
        price: 747,
        description: 'Warm chocolate cake with molten center, vanilla ice cream and raspberry sauce',
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=400&fit=crop'
    },
    {
        id: 8,
        name: 'Lavender Crème Brûlée',
        category: 'dessert',
        price: 795,
        description: 'Silky lavender-infused custard with caramelized sugar crust and candied lavender',
        image: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=500&h=400&fit=crop'
    },
    {
        id: 9,
        name: 'Pistachio and Mascarpone Tiramisu',
        category: 'dessert',
        price: 745,
        description: 'Sicilian pistachio cream layers with mascarpone, espresso soaking, and white chocolate',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2AxqEeuMzIEhJTmIL6lqPRNpxudyPPuFNqA&s'
    },
    {
        id: 10,
        name: 'Lungo Espresso with Amaretto',
        category: 'beverage',
        price: 445,
        description: 'Extended espresso shot with premium amaretto liqueur and cocoa dusting',
        image: 'https://www.nescafe.com/gb/sites/default/files/2023-08/Amaretto%20Coffee_hero.jpg'
    },
    {
        id: 11,
        name: 'Château Lafite Rothschild',
        category: 'beverage',
        price: 1995,
        description: 'Premier Grand Cru from Pauillac with elegant structure and aging complexity',
        image: 'https://www.lafite.com/wp-content/uploads/fly-images/1861/LegendesR_menu-470x646-c.jpg'
    },
    {
        id: 12,
        name: 'Cristal Champagne Cocktail',
        category: 'beverage',
        price: 2245,
        description: 'Louis Roederer Cristal with cognac, fresh berries, and edible gold',
        image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=500&h=400&fit=crop'
    },
    {
        id: 13,
        name: 'Seared Tuna',
        category: 'main',
        price: 2489,
        description: 'Rare seared ahi tuna with wasabi foam and pickled ginger',
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500&h=400&fit=crop'
    },
    {
        id: 14,
        name: 'Duck Confit',
        category: 'main',
        price: 2324,
        description: 'Tender duck leg slow-cooked in its own fat, served with cherry gastrique',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=400&fit=crop'
    },
    {
        id: 15,
        name: 'Truffle Mushroom Pasta',
        category: 'main',
        price: 1991,
        description: 'Fresh pasta with black truffle, mushrooms, parmesan, and truffle oil',
        image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&h=400&fit=crop'
    },
    {
        id: 16,
        name: 'Scallop Crudo',
        category: 'appetizer',
        price: 1745,
        description: 'Thinly sliced diver scallops with yuzu, jalapeño, and microgreens on crispy rice crackers',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLJUImo8izvEgU6QIC352s4V8vygwJJF54nA&s'
    },
    {
        id: 17,
        name: 'Sevuga Caviar on Toast Points',
        category: 'appetizer',
        price: 1895,
        description: 'Premium Sevuga caviar served with toasted points, crème fraîche, and chives',
        image: 'https://media.istockphoto.com/id/1370775170/photo/slices-of-bread-with-black-caviar-on-rustic-dark-background.jpg?s=612x612&w=0&k=20&c=5BN35uRNrtuIvkK3EflBLbP8XGbpY_cdnfxyNtKqlRY='
    },
    {
        id: 18,
        name: 'King Crab Tempura',
        category: 'appetizer',
        price: 1595,
        description: 'Golden fried king crab legs with light tempura batter, ponzu sauce, and daikon',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmtqxHofk97plrIHqXFAd1_evz7eKRTT5ANQ&s'
    },
    {
        id: 19,
        name: 'Strawberry Shortcake',
        category: 'dessert',
        price: 580,
        description: 'Fluffy sponge cake with fresh strawberries and whipped cream',
        image: 'https://abrightmoment.com/wp-content/uploads/2025/05/2-National-Burger-Day-with-Masterbuilt-Strawberry-Shortcake-@brightmomentco-copy.jpg'
    },
    {
        id: 20,
        name: 'Lemon Soufflé Tart',
        category: 'dessert',
        price: 795,
        description: 'Light lemon soufflé on pastry shell with candied lemon zest and honey glaze',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTb5FttMzvSNdDEE9AXAQO6cqO-Rq4cA_9GvQ&s'
    },
    {
        id: 21,
        name: 'White Chocolate Panna Cotta',
        category: 'dessert',
        price: 795,
        description: 'Silky white chocolate cream with passion fruit coulis and gold leaf',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDx7AnOg8uqPcJw3X53XtNMtGbWRLQRDc1nw&s'
    },
    {
        id: 22,
        name: 'Macchiato with Cardamom',
        category: 'beverage',
        price: 545,
        description: 'Espresso with steamed milk, cardamom spice, and cocoa dusting',
        image: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500&h=400&fit=crop'
    },
    {
        id: 23,
        name: 'Tropical Mango and Lychee Fusion',
        category: 'beverage',
        price: 495,
        description: 'Fresh mango and lychee puree with coconut cream, mint, and edible flowers',
        image: 'https://media.istockphoto.com/id/1403743088/photo/tropical-passion-fruit-smoothie.jpg?s=612x612&w=0&k=20&c=eaG4wg3ecmxLgqjrLi_BJjA76HrTkR290BNm5_Bfs-g='
    },
    {
        id: 24,
        name: 'Barolo Riserva',
        category: 'beverage',
        price: 1745,
        description: 'Aged Piedmont Barolo with complex tannins and fruity undertones',
        image: 'https://www.invinus.com.au/cdn/shop/files/InVinus_Gabriele-Scaglione_Barolo_Riserva-Sustainable-italian-red-wine-2.jpg?v=1744262838&width=600'
    },
    {
        id: 25,
        name: 'Pan-Seared Halibut',
        category: 'main',
        price: 2157,
        description: 'Fresh Atlantic halibut with asparagus, dill butter, and lemon foam',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=400&fit=crop'
    },
    {
        id: 26,
        name: 'Wagyu Steak',
        category: 'main',
        price: 3912,
        description: 'Premium Japanese Wagyu with Asian pear glaze and roasted root vegetables',
        image: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=500&h=400&fit=crop'
    },
    {
        id: 27,
        name: 'Lobster Newburg',
        category: 'main',
        price: 3145,
        description: 'Tender lobster meat in sherry cream sauce with egg yolk liaison, served in pastry shell',
        image: 'https://live.staticflickr.com/7007/6703905751_60823ba1b3_b.jpg'
    },
    {
        id: 28,
        name: 'Cep Mushroom Velouté',
        category: 'appetizer',
        price: 1545,
        description: 'Silky cepe mushroom soup with truffle cream, aged parmesan, and crispy sage',
        image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&h=400&fit=crop'
    },
    {
        id: 29,
        name: 'Chocolate Soufflé',
        category: 'dessert',
        price: 663,
        description: 'Light and airy chocolate soufflé with Grand Marnier sauce',
        image: 'https://media.istockphoto.com/id/135966211/photo/chocolate-souffles.jpg?s=612x612&w=0&k=20&c=fr8ZTP-fps9SUGZ36c6urjtHma_0A-e1jzhHIRPEZB4='
    },
    {
        id: 30,
        name: 'Krug Clos d\'Ambonnay',
        category: 'beverage',
        price: 2745,
        description: 'Vintage Champagne with honeyed notes and remarkable aging complexity',
        image: 'https://imami-japan.com/wp-content/uploads/2024/11/3A4A4578-news.jpg'
    }
];

// ========================================
// INITIALIZE PAGE
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded');
    initNavbar();
    initFeaturedDishes();
    initMenuPage();
    initContactForm();
    initReservationForm();
    // Initialize smooth page transitions
    if (typeof initPageTransitions === 'function') {
        initPageTransitions();
    }
});

// ========================================
// NAVBAR FUNCTIONALITY
// ========================================
function initNavbar() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        // Initialize accessibility attributes
        hamburger.setAttribute('role', 'button');
        hamburger.setAttribute('aria-label', 'Toggle navigation');
        hamburger.setAttribute('tabindex', '0');
        hamburger.setAttribute('aria-expanded', 'false');
        if (navMenu) navMenu.setAttribute('aria-hidden', 'true');

        function toggleNav() {
            const isOpen = navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', String(isOpen));
            navMenu.setAttribute('aria-hidden', String(!isOpen));
        }

        hamburger.addEventListener('click', toggleNav);
        // Keyboard support (Enter / Space)
        hamburger.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleNav();
            }
        });

        // Close menu when link is clicked
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                navMenu.setAttribute('aria-hidden', 'true');
            });
        });
    }

    // Set active link based on current page
    setActiveNavLink();
}

function setActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-menu a');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// ========================================
// PAGE TRANSITIONS
// ========================================
function createPageTransitionElement() {
    if (document.getElementById('pageTransition')) return;
    const el = document.createElement('div');
    el.id = 'pageTransition';
    el.className = 'page-transition';
    el.innerHTML = `
        <div class="pt-content">
            <div class="pt-logo">Spoonful</div>
            <div class="pt-loader">
                <span class="pt-dot"></span>
                <span class="pt-dot"></span>
                <span class="pt-dot"></span>
            </div>
        </div>
    `;
    document.body.appendChild(el);
}

function showPageTransition(duration = 800) {
    createPageTransitionElement();
    const el = document.getElementById('pageTransition');
    el.classList.add('show');
    document.body.classList.add('page-transition-active');
    return new Promise(resolve => setTimeout(resolve, duration));
}

function hidePageTransition() {
    const el = document.getElementById('pageTransition');
    if (!el) return;
    el.classList.remove('show');
    document.body.classList.remove('page-transition-active');
}

function initPageTransitions() {
    createPageTransitionElement();

    // Play a brief enter animation on page load
    const el = document.getElementById('pageTransition');
    el.classList.add('enter');
    setTimeout(() => el.classList.remove('enter'), 700);

    // Intercept internal link clicks
    document.querySelectorAll('a[href]').forEach(a => {
        try {
            const href = a.getAttribute('href');
            if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || a.target === '_blank' || a.hasAttribute('download')) return;

            a.addEventListener('click', async function(e) {
                e.preventDefault();
                const url = new URL(a.href, location.href).href;
                if (url === location.href) {
                    // If anchor on same page, allow default behavior
                    if (href.startsWith('#')) location.hash = href;
                    return;
                }

                await showPageTransition(600);
                location.href = url;
            });
        } catch (err) {
            // ignore invalid links
            console.error('Page transition setup skipped for link', err);
        }
    });

    // Animate when navigating with browser controls
    window.addEventListener('pageshow', () => {
        const el = document.getElementById('pageTransition');
        if (el) { el.classList.add('enter'); setTimeout(() => el.classList.remove('enter'), 700); }
    });
}

// ========================================
// FEATURED DISHES FUNCTIONALITY
// ========================================
function initFeaturedDishes() {
    const featuredContainer = document.getElementById('featuredDishesContainer');
    
    if (featuredContainer) {
        displayFeaturedDishes();
    }
}

function displayFeaturedDishes() {
    const featuredContainer = document.getElementById('featuredDishesContainer');

    if (!featuredContainer) return;

    featuredContainer.innerHTML = FEATURED_DISHES.map(dish => `
        <div class="featured-dish-card">
            <div class="featured-dish-image" style="background-image: url('${dish.image}');"></div>
            <div class="featured-dish-content">
                <div class="featured-dish-category">${formatCategory(dish.category)}</div>
                <h3 class="featured-dish-name">${dish.name}</h3>
                <p class="featured-dish-description">${dish.description}</p>
                <div class="featured-dish-footer">
                    <span class="featured-dish-price">₹${dish.price.toLocaleString('en-IN')}</span>
                </div>
                <div class="featured-dish-actions">
                    <div class="quantity-selector">
                        <button class="qty-btn" onclick="decreaseQty('featured-qty-${dish.id}')">-</button>
                        <input type="number" id="featured-qty-${dish.id}" class="qty-input" value="1" min="1" max="10">
                        <button class="qty-btn" onclick="increaseQty('featured-qty-${dish.id}')">+</button>
                    </div>
                    <button class="add-to-cart-btn" onclick="addToCart(event, ${dish.id}, '${dish.name}', ${dish.price}, 'featured-qty-${dish.id}', '${dish.image}')">
                        <i class="fas fa-cart-plus"></i>
                        <span>Add</span>
                    </button>
                    <button class="order-now-btn" onclick="orderNow(event, ${dish.id}, '${dish.name}', ${dish.price}, 'featured-qty-${dish.id}', '${dish.image}')">
                        <i class="fas fa-bolt"></i>
                        <span>Order Now</span>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}
function initMenuPage() {
    const menuContainer = document.getElementById('menuContainer');
    const filterButtons = document.querySelectorAll('.filter-btn');

    if (menuContainer) {
        // Load menu from API or use dummy data
        loadMenuItems();

        // Add filter button listeners
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                const filter = this.getAttribute('data-filter');
                filterMenuItems(filter);
            });
        });
    }
}

function loadMenuItems() {
    const menuContainer = document.getElementById('menuContainer');

    // Try to fetch from API, fallback to dummy data
    fetch(`${API_BASE_URL}/menu`)
        .then(response => {
            if (!response.ok) throw new Error('API not available');
            return response.json();
        })
        .then(data => {
            displayMenuItems(data);
        })
        .catch(error => {
            console.log('Using dummy menu data:', error.message);
            displayMenuItems(DUMMY_MENU);
        });
}

function displayMenuItems(items) {
    const menuContainer = document.getElementById('menuContainer');
    
    if (!items || items.length === 0) {
        menuContainer.innerHTML = '<p class="loading">No menu items found</p>';
        return;
    }

    // Use index to allow a small staggered reveal
    menuContainer.innerHTML = items.map((item, idx) => `
        <div class="menu-item" data-category="${item.category}">
            <div class="menu-item-image" style="background-image: url('${item.image}');"></div>
            <div class="menu-item-content">
                <div class="menu-item-category">${formatCategory(item.category)}</div>
                <h3>${item.name}</h3>
                <p class="menu-item-description">${item.description}</p>
                <p class="menu-item-benefit">${getBenefit(item.name)}</p>
                <div class="menu-item-footer">
                    <span class="menu-item-price">₹${item.price.toLocaleString('en-IN')}</span>
                </div>
                <div class="menu-item-actions">
                    <div class="quantity-selector">
                        <button class="qty-btn" onclick="decreaseQty('qty-${item.id}')">-</button>
                        <input type="number" id="qty-${item.id}" class="qty-input" value="1" min="1" max="10">
                        <button class="qty-btn" onclick="increaseQty('qty-${item.id}')">+</button>
                    </div>
                    <button class="add-to-cart-btn" onclick="addToCart(event, ${item.id}, '${item.name}', ${item.price}, 'qty-${item.id}', '${item.image}')">
                        <i class="fas fa-cart-plus"></i>
                        <span>Add</span>
                    </button>
                    <button class="order-now-btn" onclick="orderNow(event, ${item.id}, '${item.name}', ${item.price}, 'qty-${item.id}', '${item.image}')">
                        <i class="fas fa-bolt"></i>
                        <span>Order Now</span>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Staggered and fast reveal to feel snappy
    const menuItemsEls = menuContainer.querySelectorAll('.menu-item');
    menuItemsEls.forEach((el, i) => {
        el.classList.remove('show');
        // Force reflow for consistent animation across browsers
        void el.offsetWidth;
        setTimeout(() => el.classList.add('show'), i * 40); // 40ms stagger
    });
} 

function filterMenuItems(category) {
    const menuItems = document.querySelectorAll('.menu-item');

    menuItems.forEach(item => {
        if (category === 'all' || item.getAttribute('data-category') === category) {
            item.style.display = 'block';
            setTimeout(() => item.style.opacity = '1', 10);
        } else {
            item.style.opacity = '0';
            setTimeout(() => item.style.display = 'none', 180);
        }
    });
}

function getCategoryEmoji(category) {
    const emojis = {
        'appetizer': '🥂',
        'main': '🍖',
        'dessert': '🍰',
        'beverage': '🍷'
    };
    return emojis[category] || '🍽️';
}

function formatCategory(category) {
    return category.charAt(0).toUpperCase() + category.slice(1);
}

// ========================================
// CONTACT FORM FUNCTIONALITY
// ========================================
function initContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
    }
}

function handleContactFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const messageDiv = document.getElementById('contactMessage');

    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };

    // Validate form
    if (!validateContactForm(formData)) {
        showMessage(messageDiv, 'Please fill in all required fields', 'error');
        return;
    }

    // Send to API
    fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to send message');
        return response.json();
    })
    .then(data => {
        showMessage(messageDiv, 'Message sent successfully! We will contact you soon.', 'success');
        form.reset();
    })
    .catch(error => {
        console.error('Error:', error);
        // Fallback for when API is not available
        showMessage(messageDiv, 'Message received! We will contact you soon.', 'success');
        form.reset();
    });
}

function validateContactForm(data) {
    return data.name && data.email && data.subject && data.message;
}

// ========================================
// RESERVATION FORM FUNCTIONALITY
// ========================================
function initReservationForm() {
    const reservationForm = document.getElementById('reservationForm');

    if (reservationForm) {
        // Set minimum date to today
        const dateInput = document.getElementById('resDate');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }

        // Initialize the seat map selector (if present)
        if (typeof initSeatMap === 'function') initSeatMap();

        reservationForm.addEventListener('submit', handleReservationFormSubmit);
    }
}

function handleReservationFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const messageDiv = document.getElementById('reservationMessage');

    // Get form data (including selected table)
    const formData = {
        name: document.getElementById('resName').value,
        email: document.getElementById('resEmail').value,
        phone: document.getElementById('resPhone').value,
        guests: document.getElementById('resGuests').value,
        date: document.getElementById('resDate').value,
        time: document.getElementById('resTime').value,
        occasion: document.getElementById('resOccasion').value || 'none',
        special_requests: document.getElementById('resSpecialRequests').value || '',
        table: document.getElementById('resTable') ? document.getElementById('resTable').value || null : null
    };

    // Validate form
    if (!validateReservationForm(formData)) {
        showMessage(messageDiv, 'Please fill in all required fields', 'error');
        return;
    }

    // Validate phone number
    if (!isValidPhone(formData.phone)) {
        showMessage(messageDiv, 'Please enter a valid phone number', 'error');
        return;
    }

    // Validate table selection
    if (!formData.table) {
        showMessage(messageDiv, 'Please select a table using the seat map.', 'error');
        return;
    }

    // Send to API
    fetch(`${API_BASE_URL}/reservations`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to create reservation');
        return response.json();
    })
    .then(data => {
        showMessage(messageDiv, 'Reservation confirmed! A confirmation email has been sent to you.', 'success');
        form.reset();
        // Clear seat selection UI
        if (document.getElementById('selectedTableText')) document.getElementById('selectedTableText').textContent = 'None';
        if (document.getElementById('resTable')) document.getElementById('resTable').value = '';
        // Scroll to message
        messageDiv.scrollIntoView({ behavior: 'smooth' });
    })
    .catch(error => {
        console.error('Error:', error);
        // Fallback for when API is not available
        showMessage(messageDiv, 'Reservation received! A confirmation will be sent to you shortly.', 'success');
        form.reset();
        if (document.getElementById('selectedTableText')) document.getElementById('selectedTableText').textContent = 'None';
        if (document.getElementById('resTable')) document.getElementById('resTable').value = '';
        messageDiv.scrollIntoView({ behavior: 'smooth' });
    });
}

function validateReservationForm(data) {
    return data.name && data.email && data.phone && data.guests && data.date && data.time;
}

// ================= SEAT MAP FUNCTIONALITY =================
// Simple static layout; you can replace this with an API call later
const SEATING_LAYOUT = [
    { id: 'T1', tableNumber: '1', x_position: 90, y_position: 70, shape: 'circle', radius: 30, capacity: 2, status: 'available', notes: 'Window' },
    { id: 'T2', tableNumber: '2', x_position: 200, y_position: 70, shape: 'circle', radius: 30, capacity: 2, status: 'available' },
    { id: 'T3', tableNumber: '3', x_position: 310, y_position: 70, shape: 'rect', width: 80, height: 48, capacity: 4, status: 'reserved', notes: 'Near entrance' },
    { id: 'T4', tableNumber: '4', x_position: 420, y_position: 70, shape: 'rect', width: 80, height: 48, capacity: 4, status: 'available' },
    { id: 'T5', tableNumber: '5', x_position: 530, y_position: 70, shape: 'rect', width: 100, height: 56, capacity: 6, status: 'occupied', notes: 'VIP' },
    { id: 'T6', tableNumber: '6', x_position: 640, y_position: 70, shape: 'circle', radius: 30, capacity: 2, status: 'available' },

    { id: 'T7', tableNumber: '7', x_position: 90, y_position: 160, shape: 'rect', width: 80, height: 48, capacity: 4, status: 'reserved' },
    { id: 'T8', tableNumber: '8', x_position: 200, y_position: 160, shape: 'circle', radius: 30, capacity: 2, status: 'available' },
    { id: 'T9', tableNumber: '9', x_position: 310, y_position: 160, shape: 'circle', radius: 30, capacity: 2, status: 'available' },
    { id: 'T10', tableNumber: '10', x_position: 420, y_position: 160, shape: 'rect', width: 80, height: 48, capacity: 4, status: 'available' },
    { id: 'T11', tableNumber: '11', x_position: 530, y_position: 160, shape: 'circle', radius: 30, capacity: 2, status: 'available' },
    { id: 'T12', tableNumber: '12', x_position: 640, y_position: 160, shape: 'rect', width: 80, height: 48, capacity: 4, status: 'reserved' },

    { id: 'T13', tableNumber: '13', x_position: 90, y_position: 250, shape: 'rect', width: 100, height: 56, capacity: 6, status: 'available' },
    { id: 'T14', tableNumber: '14', x_position: 200, y_position: 250, shape: 'circle', radius: 30, capacity: 2, status: 'occupied' },
    { id: 'T15', tableNumber: '15', x_position: 310, y_position: 250, shape: 'rect', width: 80, height: 48, capacity: 4, status: 'available' },
    { id: 'T16', tableNumber: '16', x_position: 420, y_position: 250, shape: 'circle', radius: 30, capacity: 2, status: 'available' },
    { id: 'T17', tableNumber: '17', x_position: 530, y_position: 250, shape: 'rect', width: 80, height: 48, capacity: 4, status: 'reserved' },
    { id: 'T18', tableNumber: '18', x_position: 640, y_position: 250, shape: 'circle', radius: 30, capacity: 2, status: 'available' },

    { id: 'T19', tableNumber: '19', x_position: 90, y_position: 340, shape: 'rect', width: 100, height: 56, capacity: 6, status: 'available' },
    { id: 'T20', tableNumber: '20', x_position: 200, y_position: 340, shape: 'rect', width: 80, height: 48, capacity: 4, status: 'occupied' },
    { id: 'T21', tableNumber: '21', x_position: 310, y_position: 340, shape: 'circle', radius: 30, capacity: 2, status: 'reserved' },
    { id: 'T22', tableNumber: '22', x_position: 420, y_position: 340, shape: 'rect', width: 80, height: 48, capacity: 4, status: 'available' },
    { id: 'T23', tableNumber: '23', x_position: 530, y_position: 340, shape: 'circle', radius: 30, capacity: 2, status: 'available' },
    { id: 'T24', tableNumber: '24', x_position: 640, y_position: 340, shape: 'rect', width: 80, height: 48, capacity: 4, status: 'available' },

    { id: 'T25', tableNumber: '25', x_position: 90, y_position: 430, shape: 'rect', width: 140, height: 64, capacity: 8, status: 'reserved' },
    { id: 'T26', tableNumber: '26', x_position: 200, y_position: 430, shape: 'circle', radius: 30, capacity: 2, status: 'available' },
    { id: 'T27', tableNumber: '27', x_position: 310, y_position: 430, shape: 'rect', width: 100, height: 56, capacity: 6, status: 'available' },
    { id: 'T28', tableNumber: '28', x_position: 420, y_position: 430, shape: 'circle', radius: 30, capacity: 2, status: 'available' },
    { id: 'T29', tableNumber: '29', x_position: 530, y_position: 430, shape: 'rect', width: 80, height: 48, capacity: 4, status: 'available' },
    { id: 'T30', tableNumber: '30', x_position: 640, y_position: 430, shape: 'rect', width: 140, height: 64, capacity: 8, status: 'occupied' }
];

function initSeatMap() {
    const seatSvg = document.getElementById('seatMap');
    if (!seatSvg) return;
    renderSeatMap();
    // Re-render on resize for better responsiveness
    window.addEventListener('resize', debounce(renderSeatMap, 150));
}

function renderSeatMap() {
    const svg = document.getElementById('seatMap');
    const tooltip = document.getElementById('seatTooltip');
    if (!svg) return;

    // Clear previous
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    // Floor background
    const floorBg = document.createElementNS('http://www.w3.org/2000/svg','rect');
    floorBg.setAttribute('x', 0);
    floorBg.setAttribute('y', 0);
    floorBg.setAttribute('width', 800);
    floorBg.setAttribute('height', 480);
    floorBg.setAttribute('class','floor-bg');
    svg.appendChild(floorBg);

    // Fixed floor features (bar) - simple examples
    const bar = document.createElementNS('http://www.w3.org/2000/svg','rect');
    bar.setAttribute('x', 620);
    bar.setAttribute('y', 20);
    bar.setAttribute('width', 140);
    bar.setAttribute('height', 80);
    bar.setAttribute('rx', 6);
    bar.setAttribute('class','floor-feature floor-bar');
    svg.appendChild(bar);
    const barLabel = document.createElementNS('http://www.w3.org/2000/svg','text');
    barLabel.setAttribute('x', 690);
    barLabel.setAttribute('y', 60);
    barLabel.setAttribute('text-anchor','middle');
    barLabel.setAttribute('class','floor-label');
    barLabel.textContent = 'Bar';
    svg.appendChild(barLabel);

    // Create a group that will be transformed for pan/zoom
    const mapGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
    mapGroup.setAttribute('id','mapGroup');
    svg.appendChild(mapGroup);

    SEATING_LAYOUT.forEach(table => {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('class', 'table');
        g.setAttribute('tabindex', '0');
        g.setAttribute('role', 'button');
        g.setAttribute('aria-pressed', 'false');
        g.setAttribute('aria-disabled', table.status !== 'available' ? 'true' : 'false');
        g.setAttribute('aria-label', `Table ${table.tableNumber}, ${table.capacity} seats, ${table.status}`);
        g.dataset.tableId = table.id;

        // Tooltip (native title kept for accessibility)
        const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        title.textContent = `Table ${table.tableNumber} — ${table.capacity} seats — ${table.status}${table.notes ? ' — ' + table.notes : ''}${table.guest ? ' — Guest: ' + table.guest : ''}`;
        g.appendChild(title);

        // shape
        let shapeEl;
        if (table.shape === 'circle') {
            const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            c.setAttribute('cx', table.x_position);
            c.setAttribute('cy', table.y_position);
            c.setAttribute('r', table.radius || 34);
            c.setAttribute('class', `table-shape table-${table.status}`);
            c.setAttribute('data-table-id', table.id);
            g.appendChild(c);
            shapeEl = c;
        } else {
            const w = table.width || 80;
            const h = table.height || 48;
            const r = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            r.setAttribute('x', table.x_position - w / 2);
            r.setAttribute('y', table.y_position - h / 2);
            r.setAttribute('width', w);
            r.setAttribute('height', h);
            r.setAttribute('rx', 8);
            r.setAttribute('class', `table-shape table-${table.status}`);
            r.setAttribute('data-table-id', table.id);
            g.appendChild(r);
            shapeEl = r;
        }

        // Label
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', table.x_position);
        label.setAttribute('y', table.y_position + 4);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('class', 'table-label');
        label.setAttribute('font-size', '14');
        label.textContent = table.tableNumber;
        g.appendChild(label);

        // Capacity badge (small circle + number)
        const capX = table.x_position + 28;
        const capY = table.y_position - 28;
        const capCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        capCircle.setAttribute('cx', capX);
        capCircle.setAttribute('cy', capY);
        capCircle.setAttribute('r', 12);
        capCircle.setAttribute('class', 'table-capacity');
        const capText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        capText.setAttribute('x', capX);
        capText.setAttribute('y', capY + 4);
        capText.setAttribute('text-anchor', 'middle');
        capText.setAttribute('class', 'table-capacity-text');
        capText.setAttribute('font-size', '11');
        capText.textContent = table.capacity;
        g.appendChild(capCircle);
        g.appendChild(capText);

        // Status small icon
        const sX = table.x_position - 28;
        const sY = table.y_position - 28;
        const sCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        sCircle.setAttribute('cx', sX);
        sCircle.setAttribute('cy', sY);
        sCircle.setAttribute('r', 8);
        sCircle.setAttribute('class', `table-status-icon table-status-${table.status}`);
        g.appendChild(sCircle);

        // Event handlers (click/keyboard)
        g.addEventListener('click', () => selectTable(table.id));
        g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectTable(table.id); } });

        // Hover tooltip handling (show custom tooltip)
        g.addEventListener('mousemove', (evt) => showSeatTooltip(evt, table));
        g.addEventListener('mouseleave', () => hideSeatTooltip());

        mapGroup.appendChild(g);
    });

    // After render update live stats
    updateSeatStats();
}

// Show floating tooltip inside seatmap container
function showSeatTooltip(evt, table) {
    // If the table is selected, do not show hover tooltip (keeps UI clean)
    if (document.getElementById('resTable') && document.getElementById('resTable').value === table.id) return;

    const tooltip = document.getElementById('seatTooltip');
    if (!tooltip) return;
    tooltip.style.display = 'block';
    tooltip.setAttribute('aria-hidden', 'false');

    const container = document.querySelector('.seatmap-container');
    const rect = container.getBoundingClientRect();
    // Position tooltip near cursor, but within container bounds
    const x = Math.min(rect.width - 180, evt.clientX - rect.left + 12);
    const y = Math.max(8, evt.clientY - rect.top + 12);

    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;

    tooltip.innerHTML = `<strong>Table ${table.tableNumber}</strong> — ${table.capacity} seats<br><em>${table.status.toUpperCase()}</em>${table.notes ? '<br>' + escapeHtml(table.notes) : ''}${table.guest ? '<br>Guest: ' + escapeHtml(table.guest) : ''}`;
}

function hideSeatTooltip() {
    const tooltip = document.getElementById('seatTooltip');
    if (!tooltip) return;
    tooltip.style.display = 'none';
    tooltip.setAttribute('aria-hidden', 'true');
}

// Small helper to escape HTML in notes
function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function updateSeatStats() {
    const availableSeatsEl = document.getElementById('availableSeatsCount');
    const availableTablesEl = document.getElementById('availableTablesCount');
    const reservedEl = document.getElementById('reservedCount');
    const occupiedEl = document.getElementById('occupiedCount');

    let availableSeats = 0; let availableTables = 0; let reserved = 0; let occupied = 0;
    SEATING_LAYOUT.forEach(t => {
        if (t.status === 'available') { availableTables++; availableSeats += (t.capacity || 0); }
        if (t.status === 'reserved') reserved++;
        if (t.status === 'occupied') occupied++;
    });

    if (availableSeatsEl) availableSeatsEl.textContent = availableSeats;
    if (availableTablesEl) availableTablesEl.textContent = availableTables;
    if (reservedEl) reservedEl.textContent = reserved;
    if (occupiedEl) occupiedEl.textContent = occupied;
}

// ================= Full map / Pan & Zoom =================
const panZoom = { enabled: false, scale: 1, tx: 0, ty: 0, minScale: 0.6, maxScale: 2.5, dragging: false, lastX: 0, lastY: 0 };

function initPanZoom() {
    const container = document.querySelector('.seatmap-container');
    if (!container) return;

    container.addEventListener('wheel', (e) => {
        if (!panZoom.enabled) return;
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.08 : 0.08;
        zoomBy(delta, e);
    }, { passive: false });

    container.addEventListener('pointerdown', (e) => {
        if (!panZoom.enabled) return;
        panZoom.dragging = true;
        panZoom.lastX = e.clientX;
        panZoom.lastY = e.clientY;
        container.setPointerCapture && container.setPointerCapture(e.pointerId);
        container.classList.add('pan-active');
    });

    container.addEventListener('pointermove', (e) => {
        if (!panZoom.enabled || !panZoom.dragging) return;
        const dx = e.clientX - panZoom.lastX;
        const dy = e.clientY - panZoom.lastY;
        panZoom.tx += dx;
        panZoom.ty += dy;
        panZoom.lastX = e.clientX;
        panZoom.lastY = e.clientY;
        setMapTransform();
    });

    container.addEventListener('pointerup', (e) => {
        if (!panZoom.enabled) return;
        panZoom.dragging = false;
        try { container.releasePointerCapture && container.releasePointerCapture(e.pointerId); } catch (err) {}
        container.classList.remove('pan-active');
    });

    container.addEventListener('pointercancel', () => { panZoom.dragging = false; container.classList.remove('pan-active'); });
}

function setMapTransform() {
    const mapGroup = document.getElementById('mapGroup');
    if (!mapGroup) return;
    mapGroup.setAttribute('transform', `translate(${panZoom.tx} ${panZoom.ty}) scale(${panZoom.scale})`);
}

function zoomBy(delta, event) {
    const prev = panZoom.scale;
    panZoom.scale = Math.max(panZoom.minScale, Math.min(panZoom.maxScale, panZoom.scale + delta));

    if (event && event.clientX !== undefined) {
        const container = document.querySelector('.seatmap-container');
        const rect = container.getBoundingClientRect();
        const cx = event.clientX - rect.left;
        const cy = event.clientY - rect.top;
        const s = panZoom.scale / prev;
        panZoom.tx = cx - s * (cx - panZoom.tx);
        panZoom.ty = cy - s * (cy - panZoom.ty);
    }

    setMapTransform();
}

function toggleFullMap() {
    const wrap = document.getElementById('seatMapWrap');
    panZoom.enabled = !panZoom.enabled;
    if (panZoom.enabled) {
        wrap.classList.add('full-map');
        document.body.classList.add('full-map-active');
    } else {
        wrap.classList.remove('full-map');
        document.body.classList.remove('full-map-active');
        resetMapView();
    }
}

function resetMapView() {
    panZoom.scale = 1; panZoom.tx = 0; panZoom.ty = 0; setMapTransform();
}

function fitMapToView() {
    // Simple fit: reset and center
    resetMapView();
    const svg = document.getElementById('seatMap');
    const rect = svg.getBoundingClientRect();
    // center calculations could be improved later
}

function selectTable(tableId) {
    // Sync 3D if not called from 3D
    if (window._restaurant3DMapSync && !window._restaurant3DMapSync._from3D) {
        window._restaurant3DMapSync(tableId, false);
    }
    // Clear previous selection visual
    const prev = document.querySelector('.table-shape.table-selected');
    if (prev) {
        prev.classList.remove('table-selected');
        if (prev.parentElement) prev.parentElement.setAttribute('aria-pressed', 'false');
    }

    // Find the table model and element
    const table = SEATING_LAYOUT.find(t => t.id === tableId);
    if (!table) return;

    // Prevent selecting non-available tables
    if (table.status !== 'available') {
        showNotification(`Table ${table.tableNumber} is ${table.status} and cannot be selected.`, 'warning');
        // Restore any previous selection
        if (document.getElementById('resTable') && document.getElementById('resTable').value) {
            const prevId = document.getElementById('resTable').value;
            const prevElem = document.querySelector(`[data-table-id="${prevId}"]`);
            if (prevElem) prevElem.classList.add('table-selected');
        }
        return;
    }

    // Find the shape element for this table
    const elem = document.querySelector(`[data-table-id="${tableId}"]`);
    if (!elem) return;

    // Toggle selection if already selected
    const isSelected = elem.classList.contains('table-selected');
    const parentGroup = elem.parentElement || null;
    if (isSelected) {
        elem.classList.remove('table-selected');
        if (parentGroup) parentGroup.setAttribute('aria-pressed', 'false');
        if (document.getElementById('resTable')) document.getElementById('resTable').value = '';
        if (document.getElementById('selectedTableText')) document.getElementById('selectedTableText').textContent = 'None';
        return;
    }

    // Mark selected
    elem.classList.add('table-selected');
    if (parentGroup) parentGroup.setAttribute('aria-pressed', 'true');
    if (document.getElementById('resTable')) document.getElementById('resTable').value = tableId;
    if (document.getElementById('selectedTableText')) document.getElementById('selectedTableText').textContent = `Table ${table.tableNumber} — ${table.capacity} seats${table.notes ? ' — ' + table.notes : ''}`;
}

// Small debounce helper
function debounce(fn, wait) {
    let t;
    return function(...args) { clearTimeout(t); t = setTimeout(() => fn.apply(this, args), wait); };
}

function isValidPhone(phone) {
    // Simple phone validation - at least 10 digits
    const phoneRegex = /^\d{10,}$/;
    const digitsOnly = phone.replace(/\D/g, '');
    return phoneRegex.test(digitsOnly);
}

// Simple email validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Fallback: add item to localStorage demo cart when API is unavailable
function addToCartLocalStorage(dishId, dishName, price, quantity, image) {
    const cart = JSON.parse(localStorage.getItem('demoCart') || '{"items": [], "total": 0}');
    const existing = cart.items.find(i => i.dishId === dishId);
    if (existing) {
        existing.quantity += quantity;
        existing.subtotal = existing.quantity * existing.price;
    } else {
        cart.items.push({ dishId, dishName, price, quantity, image, subtotal: price * quantity });
    }
    cart.total = cart.items.reduce((s, it) => s + it.subtotal, 0);
    localStorage.setItem('demoCart', JSON.stringify(cart));
}

// Optimistic add: update UI & localStorage immediately for snappy UX
function optimisticAddToCart(dishId, dishName, price, quantity, image) {
    // Update demo storage
    addToCartLocalStorage(dishId, dishName, price, quantity, image);

    // Reflect immediately in UI
    const cart = JSON.parse(localStorage.getItem('demoCart'));
    displayCartItems(cart);
    updateCartCount();
    animateCartIcon();
    showNotification(`✓ ${dishName} (${quantity}) added to cart`, 'success');
    // Open cart modal briefly to show inbox feedback
    try { openCartModal(); } catch (e) {}
}

// Order a single item immediately (adds to cart then opens checkout)
async function orderNow(event, dishId, dishName, price, quantityInputId, image) {
    const button = event ? event.currentTarget || event.target : null;
    if (button) {
        button.disabled = true;
        // Save original HTML so we can restore it fast
        button.dataset.originalHtml = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Ordering...</span>';
    }

    const qtyInput = document.getElementById(quantityInputId);
    const quantity = qtyInput ? parseInt(qtyInput.value) : 1;

    // Optimistic add + immediate checkout open for snappy UX
    optimisticAddToCart(dishId, dishName, price, quantity, image);
    if (qtyInput) qtyInput.value = 1;
    try { openCheckoutModal(); } catch (e) { /* ignore */ }

    // Send background API request to reconcile with server
    try {
        const response = await fetch(`${API_BASE_URL}/cart/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dishId, dishName, price, quantity, image })
        });

        const data = await response.json();
        if (data.success) {
            // Server's authoritative cart: clear demoCart to avoid duplication and refresh
            localStorage.removeItem('demoCart');
            try { await loadCartItems(); } catch (e) {}
            updateCartCount();
            showNotification(`🎉 ${dishName} added to your server cart`, 'success');
        } else {
            showNotification('❌ Error adding to server cart: ' + data.message + '. Saved locally.', 'warning');
        }
    } catch (error) {
        console.error('Error ordering now request:', error);
        showNotification('⚠️ Added to local cart (offline demo mode).', 'warning');
    } finally {
        if (button) {
            button.disabled = false;
            button.innerHTML = button.dataset.originalHtml || '<i class="fas fa-bolt"></i><span>Order Now</span>';
            delete button.dataset.originalHtml;
        }
    }
}

// ========================================
// CART FUNCTIONS
// ========================================

// Get benefit text for each dish
function getBenefit(dishName) {
    const benefits = {
        'Grilled Salmon': '✓ Rich in Omega-3 fatty acids for heart health',
        'Beef Tenderloin': '✓ Excellent source of protein and iron',
        'Pan-Seared Dover Sole': '✓ Low in calories, high in nutrients',
        'French Onion Soup': '✓ Nourishing comfort food with caramelized flavors',
        'Grilled Oysters with Caviar': '✓ Premium protein with luxury caviar topping',
        'Foie Gras Parfait': '✓ Delicate French delicacy for special occasions',
        'Chocolate Lava Cake': '✓ Indulgent dessert with warm chocolate center',
        'Lavender Crème Brûlée': '✓ Elegant floral-infused custard dessert',
        'Pistachio and Mascarpone Tiramisu': '✓ Rich Italian flavors with pistachio complexity',
        'Lungo Espresso with Amaretto': '✓ Premium coffee with almond liqueur notes',
        'Château Lafite Rothschild': '✓ World-class Bordeaux wine with aging complexity',
        'Cristal Champagne Cocktail': '✓ Luxury celebration drink with premium ingredients',
        'Seared Tuna': '✓ Fresh sashimi-grade tuna with authentic wasabi',
        'Duck Confit': '✓ Tender duck slow-cooked in its own fat',
        'Truffle Mushroom Pasta': '✓ Black truffle-infused pasta with earthy flavors',
        'Scallop Crudo': '✓ Fresh diver scallops prepared with precision',
        'Sevuga Caviar on Toast Points': '✓ Premium caviar with crispy toast accompany',
        'King Crab Tempura': '✓ Golden fried king crab legs with light batter',
        'Strawberry Shortcake': '✓ Classic dessert with fresh strawberries and cream',
        'Lemon Soufflé Tart': '✓ Light and fluffy lemon dessert with honey glaze',
        'White Chocolate Panna Cotta': '✓ Silky white chocolate cream with passion fruit',
        'Macchiato with Cardamom': '✓ Aromatic coffee with exotic cardamom spice',
        'Tropical Mango and Lychee Fusion': '✓ Fresh tropical fruits with creamy coconut',
        'Barolo Riserva': '✓ Aged Italian Piedmont wine with complex tannins',
        'Pan-Seared Halibut': '✓ Fresh Atlantic fish with delicate lemon butter',
        'Wagyu Steak': '✓ Premium Japanese beef with marbling perfection',
        'Lobster Newburg': '✓ Classic lobster in creamy sherry sauce',
        'Cep Mushroom Velouté': '✓ Silky mushroom soup with truffle essence',
        'Chocolate Soufflé': '✓ Light and airy chocolate with Grand Marnier',
        'Krug Clos d\'Ambonnay': '✓ Vintage champagne with honeyed complexity',
        'Truffle-Infused Lobster Tail': '✓ Premium lobster with black truffle luxury',
        'Kobe Beef Ribeye': '✓ A5 Japanese Kobe beef with perfect marbling',
        'Black Truffle Risotto': '✓ Creamy arborio rice with black truffle luxury',
        'Wagyu Steak Premium': '✓ Prime Japanese Wagyu with truffle perfection',
        'Pan-Seared Duck Breast': '✓ Succulent duck breast with cherry gastrique',
    };
    
    return benefits[dishName] || '✓ Premium quality dining experience';
}

// Quantity selector functions
function increaseQty(inputId) {
    const input = document.getElementById(inputId);
    const currentValue = parseInt(input.value);
    if (currentValue < 10) {
        input.value = currentValue + 1;
    }
}

function decreaseQty(inputId) {
    const input = document.getElementById(inputId);
    const currentValue = parseInt(input.value);
    if (currentValue > 1) {
        input.value = currentValue - 1;
    }
}

// Add item to cart via API
async function addToCart(event, dishId, dishName, price, quantityInputId, image) {
    const quantityInput = document.getElementById(quantityInputId);
    const quantity = parseInt(quantityInput ? quantityInput.value : '1');

    // Try to find button element
    let button = null;
    if (event && event.currentTarget) button = event.currentTarget.closest('.add-to-cart-btn') || event.currentTarget;
    if (!button && event && event.target) button = event.target.closest('.add-to-cart-btn') || event.target;

    // Optimistic update for snappy UX
    optimisticAddToCart(dishId, dishName, price, quantity, image);
    if (quantityInput) quantityInput.value = 1; // Reset UI quickly

    // Small visual feedback on button
    if (button) {
        button.disabled = true;
        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Adding...</span>';

        // Perform API call in background
        try {
            const response = await fetch(`${API_BASE_URL}/cart/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dishId, dishName, price, quantity, image })
            });
            const data = await response.json();
            if (data.success) {
                // Server now authoritative: clear demoCart to avoid duplication
                localStorage.removeItem('demoCart');
                // Refresh with server data
                try { await loadCartItems(); } catch (e) {}
                updateCartCount();
                showNotification(`🎉 ${dishName} added to your server cart`, 'success');
            } else {
                showNotification('❌ Error adding to server cart: ' + data.message + '. Saved locally.', 'warning');
            }
        } catch (err) {
            console.error('Error sending add to cart request:', err);
            // Keep demo cart as-is; inform user
            showNotification('⚠️ Added to local cart (offline demo mode). Will sync when online.', 'warning');
        } finally {
            // Restore button quickly
            button.disabled = false;
            button.innerHTML = '<i class="fas fa-cart-plus"></i><span>Add</span>';
        }
    } else {
        // If button not found, still try to send API request
        try {
            const response = await fetch(`${API_BASE_URL}/cart/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dishId, dishName, price, quantity, image })
            });
            const data = await response.json();
            if (data.success) {
                localStorage.removeItem('demoCart');
                try { await loadCartItems(); } catch (e) {}
                updateCartCount();
                showNotification(`🎉 ${dishName} added to your server cart`, 'success');
            }
        } catch (err) {
            console.error('Error sending add to cart request:', err);
            showNotification('⚠️ Added to local cart (offline demo mode).', 'warning');
        }
    }
}

// Update cart count display
async function updateCartCount() {
    const cartCountElement = document.getElementById('cartCount');
    const cartBadge = document.getElementById('cartBadge');

    try {
        const response = await fetch(`${API_BASE_URL}/cart`);
        const data = await response.json();

        if (data.success && data.data.items && data.data.items.length > 0) {
            const distinctCount = data.data.items.length;
            // Prefer showing distinct dish count on badge/icon
            if (cartCountElement) {
                cartCountElement.textContent = distinctCount;
                cartCountElement.style.display = 'block';
            }
            if (cartBadge) {
                cartBadge.textContent = distinctCount;
                cartBadge.style.display = 'inline-block';
            }
            return;
        } else {
            if (cartCountElement) { cartCountElement.style.display = 'none'; cartCountElement.textContent = '0'; }
            if (cartBadge) { cartBadge.style.display = 'none'; cartBadge.textContent = '0'; }
        }
    } catch (error) {
        console.error('Error updating cart count from API:', error);
    }

    // Fallback to localStorage demoCart
    const cart = JSON.parse(localStorage.getItem('demoCart') || '{"items": [], "total": 0}');
    if (cart.items && cart.items.length > 0) {
        const distinctCount = cart.items.length;
        if (cartCountElement) { cartCountElement.textContent = distinctCount; cartCountElement.style.display = 'block'; }
        if (cartBadge) { cartBadge.textContent = distinctCount; cartBadge.style.display = 'inline-block'; }
    } else {
        if (cartCountElement) { cartCountElement.style.display = 'none'; cartCountElement.textContent = '0'; }
        if (cartBadge) { cartBadge.style.display = 'none'; cartBadge.textContent = '0'; }
    }
}

// Initialize cart count on page load
window.addEventListener('load', () => {
    updateCartCount();
});

// ========================================
// BEAUTIFUL NOTIFICATION SYSTEM
// ========================================

// Show beautiful notification instead of alert
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.luxury-notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `luxury-notification notification-${type}`;

    // Get icon based on type
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };

    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${icons[type] || icons.info}</span>
            <span class="notification-message">${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">×</button>
        <div class="notification-progress"></div>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);

    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}

// Animate cart icon when item is added
function animateCartIcon() {
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.classList.add('cart-bounce');
        setTimeout(() => cartIcon.classList.remove('cart-bounce'), 600);
    }
}

// ========================================
// CHECKOUT FUNCTIONALITY
// ========================================

// Open checkout modal
function openCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    loadCheckoutData();
}

// Close checkout modal
function closeCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Load checkout data
async function loadCheckoutData() {
    try {
        const response = await fetch(`${API_BASE_URL}/cart`);
        const data = await response.json();

        if (data.success && data.data.items.length > 0) {
            const checkoutItemsContainer = document.getElementById('checkoutItems');
            const subtotalElement = document.getElementById('checkoutSubtotal');
            const taxElement = document.getElementById('checkoutTax');
            const totalElement = document.getElementById('checkoutTotal');

            checkoutItemsContainer.innerHTML = '';

            data.data.items.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'checkout-item';
                itemDiv.innerHTML = `
                    <span>${item.dishName} x${item.quantity}</span>
                    <span>₹${item.subtotal.toLocaleString()}</span>
                `;
                checkoutItemsContainer.appendChild(itemDiv);
            });

            const subtotal = data.data.total;
            const tax = Math.round(subtotal * 0.18);
            const total = subtotal + tax;

            subtotalElement.textContent = subtotal.toLocaleString();
            taxElement.textContent = tax.toLocaleString();
            totalElement.textContent = total.toLocaleString();
        } else {
            showNotification('❌ Your cart is empty. Please add items before checkout.', 'error');
            closeCheckoutModal();
        }
    } catch (error) {
        console.error('Error loading checkout data:', error);
        // Fallback to local storage
        loadCheckoutFromLocalStorage();
    }
}

// Fallback function to load checkout from local storage
function loadCheckoutFromLocalStorage() {
    const cart = JSON.parse(localStorage.getItem('demoCart') || '{"items": [], "total": 0}');

    if (cart.items.length > 0) {
        const checkoutItemsContainer = document.getElementById('checkoutItems');
        const subtotalElement = document.getElementById('checkoutSubtotal');
        const taxElement = document.getElementById('checkoutTax');
        const totalElement = document.getElementById('checkoutTotal');

        checkoutItemsContainer.innerHTML = '';

        cart.items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'checkout-item';
            itemDiv.innerHTML = `
                <span>${item.dishName} x${item.quantity}</span>
                <span>₹${item.subtotal.toLocaleString()}</span>
            `;
            checkoutItemsContainer.appendChild(itemDiv);
        });

        const subtotal = cart.total;
        const tax = Math.round(subtotal * 0.18);
        const total = subtotal + tax;

        subtotalElement.textContent = subtotal.toLocaleString();
        taxElement.textContent = tax.toLocaleString();
        totalElement.textContent = total.toLocaleString();
    } else {
        showNotification('❌ Your cart is empty. Please add items before checkout.', 'error');
        closeCheckoutModal();
    }
}

// Place order
async function placeOrder() {
    const form = document.getElementById('checkoutForm');

    if (!form.checkValidity()) {
        showNotification('❌ Please fill in all required fields.', 'error');
        return;
    }

    const customerName = document.getElementById('customerName').value;
    const customerEmail = document.getElementById('customerEmail').value;
    const customerPhone = document.getElementById('customerPhone').value;
    const deliveryAddress = document.getElementById('deliveryAddress').value;
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');

    if (!paymentMethod) {
        showNotification('❌ Please select a payment method.', 'error');
        return;
    }

    // Show loading state
    const submitButton = document.querySelector('.checkout-footer .btn-primary');
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    }

    try {
        const response = await fetch(`${API_BASE_URL}/cart/checkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                customerName,
                customerEmail,
                customerPhone,
                deliveryAddress,
                paymentMethod: paymentMethod.value
            })
        });

        const data = await response.json();

        if (data.success) {
            const order = data.data;
            showNotification(`🎉 Order placed successfully! Order ID: ${order.orderId}`, 'success');

            // If payment method is UPI, show UPI instructions and allow the user to confirm payment
            if (order.payment && order.payment.method === 'upi' && order.payment.status === 'pending') {
                // Show UPI payment modal (scan QR or use UPI ID)
                setTimeout(() => {
                    showUPIPaymentModal(order);
                }, 600);
            } else {
                // Show detailed order confirmation for non-UPI flows
                setTimeout(() => {
                    alert(`✓ Order Confirmed!\n\nOrder ID: ${order.orderId}\nTotal: ₹${order.pricing.total.toLocaleString()}\nPayment: ${order.payment.method.toUpperCase()}\nEstimated Delivery: ${new Date(order.estimatedDelivery).toLocaleString()}\n\nYou will receive a confirmation email shortly.`);
                    closeCheckoutModal();
                    updateCartCount();

                    // Reset form
                    form.reset();
                }, 1000);
            }
        } else {
            showNotification('❌ Error placing order: ' + data.message, 'error');
        }
    } catch (error) {
        console.error('Error placing order:', error);
        showNotification('❌ Error placing order. Please try again.', 'error');
    } finally {
        // Reset button state
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Place Order';
        }
    }
}

// ----------------------------------------
// UPI Payment Modal & Confirmation Helpers
// ----------------------------------------
function showUPIPaymentModal(order) {
    // Remove existing modal if any
    const existing = document.getElementById('upiModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'upiModal';
    modal.className = 'modal show';
    modal.innerHTML = `
        <div class="modal-content upi-modal">
            <div class="modal-header">
                <h2>Pay via UPI</h2>
                <span class="close-modal" id="closeUpiModal">&times;</span>
            </div>
            <div class="modal-body">
                <p>Scan the QR in your UPI app or use the UPI ID shown below. After paying, enter your UPI transaction ID and click "Confirm Payment".</p>
                <div style="display:flex;gap:1rem;align-items:flex-start;flex-wrap:wrap;">
                    <div style="min-width:180px;">
                        ${order.payment && order.payment.instructions && order.payment.instructions.qrUrl ? `<img src="${order.payment.instructions.qrUrl}" alt="UPI QR" style="max-width:220px;border-radius:8px;border:1px solid rgba(255,255,255,0.06);">` : `<div style="width:220px;height:220px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.02);border-radius:8px;color:#c9a961;">QR not configured</div>`}
                    </div>
                    <div style="flex:1;min-width:220px;">
                        <p><strong>UPI ID:</strong> <span id="upiIdText">${order.payment && order.payment.instructions && order.payment.instructions.upiNumber ? order.payment.instructions.upiNumber : 'Not configured'}</span></p>
                        <label for="upiTxnId">UPI Transaction ID *</label>
                        <input id="upiTxnId" class="input" placeholder="Enter UPI transaction id" style="width:100%;padding:0.6rem;margin:0.4rem 0;border-radius:6px;border:1px solid #ddd;background:transparent;color:inherit;">
                        <div style="margin-top:0.6rem;display:flex;gap:0.6rem;">
                            <button class="btn btn-secondary" id="cancelUpiBtn">Cancel</button>
                            <button class="btn btn-primary" id="confirmUpiBtn">Confirm Payment</button>
                        </div>
                        <p style="font-size:0.9rem;margin-top:0.6rem;color:#b0b0c0;">Tip: You can provide the UPI transaction id shown by your UPI app after completing the payment.</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Wire up buttons
    document.getElementById('closeUpiModal').addEventListener('click', closeUPIModal);
    document.getElementById('cancelUpiBtn').addEventListener('click', closeUPIModal);
    document.getElementById('confirmUpiBtn').addEventListener('click', function() {
        const txnId = document.getElementById('upiTxnId').value.trim();
        if (!txnId) {
            showNotification('❌ Please enter the UPI transaction ID', 'error');
            return;
        }
        confirmUPIPayment(order.orderId, txnId);
    });
}

function closeUPIModal() {
    const el = document.getElementById('upiModal');
    if (el) el.remove();
}

async function confirmUPIPayment(orderId, transactionId) {
    try {
        const res = await fetch(`${API_BASE_URL}/cart/confirm`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId, transactionId })
        });
        const data = await res.json();
        if (data.success) {
            showNotification('✅ Payment confirmed. Order is complete.', 'success');
            closeUPIModal();

            // Finalize UI: show alert with details and reset checkout UI
            const order = data.data;
            setTimeout(() => {
                alert(`✓ Order Confirmed!\n\nOrder ID: ${order.orderId}\nTotal: ₹${order.pricing.total.toLocaleString()}\nPayment: UPI\nTransaction: ${order.payment.transactionId}\nEstimated Delivery: ${new Date(order.estimatedDelivery).toLocaleString()}`);
                closeCheckoutModal();
                updateCartCount();
                const form = document.getElementById('checkoutForm');
                if (form) form.reset();
            }, 400);
        } else {
            showNotification('❌ ' + (data.message || 'Unable to confirm payment'), 'error');
        }
    } catch (err) {
        console.error(err);
        showNotification('❌ Error confirming payment. Please try again.', 'error');
    }
}

// Cart Modal Functions
async function openCartModal() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        await loadCartItems();
    }
}

function closeCartModal() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

async function loadCartItems() {
    try {
        const response = await fetch(`${API_BASE_URL}/cart`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (data.success && data.data.items.length > 0) {
            displayCartItems(data.data);
            showCartPaymentSection();
        } else {
            // Fallback to local storage
            loadCartFromLocalStorage();
        }
    } catch (error) {
        console.error('Error loading cart items:', error);
        // Fallback to local storage
        loadCartFromLocalStorage();
    }
}

function loadCartFromLocalStorage() {
    const cart = JSON.parse(localStorage.getItem('demoCart') || '{"items": [], "total": 0}');

    if (cart.items.length > 0) {
        displayCartItems(cart);
        showCartPaymentSection();
    } else {
        displayEmptyCart();
        hideCartPaymentSection();
    }
}

function displayCartItems(cartData) {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');
    const cartBadge = document.getElementById('cartBadge');

    if (!cartItemsContainer || !cartTotalElement) return;

    cartItemsContainer.innerHTML = '';

    cartData.items.forEach(item => {
        const dishId = (item.dishId !== undefined) ? item.dishId : (item.id !== undefined ? item.id : null);
        const qty = item.quantity || 1;
        const subtotal = item.subtotal || (item.price * qty);

        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.setAttribute('data-dish-id', dishId);
        itemDiv.innerHTML = `
            <div class="cart-item-info">
                <img src="${item.image || '/images/default-dish.jpg'}" alt="${item.dishName}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4>${item.dishName}</h4>
                    <p class="cart-item-price">₹${item.price.toLocaleString()} each</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" aria-label="Decrease quantity" onclick="updateCartItemQuantity(${dishId}, ${qty - 1})"><i class="fas fa-minus"></i></button>
                        <input type="text" class="quantity-input" value="${qty}" readonly aria-label="Quantity of ${item.dishName}">
                        <button class="quantity-btn" aria-label="Increase quantity" onclick="updateCartItemQuantity(${dishId}, ${qty + 1})"><i class="fas fa-plus"></i></button>
                        <span class="quantity-spinner" style="display:none; margin-left:8px;"><i class="fas fa-spinner fa-spin"></i></span>
                    </div>
                </div>
            </div>
            <div class="cart-item-meta">
                <div class="cart-item-total">₹${subtotal.toLocaleString()}</div>
                <button class="remove-item remove-item-btn" aria-label="Remove ${item.dishName}" onclick="removeCartItem(${dishId})"><i class="fas fa-trash-alt"></i></button>
            </div>
        `;
        cartItemsContainer.appendChild(itemDiv);
    });

    // Update total and badge (number of distinct dishes)
    cartTotalElement.textContent = `₹${cartData.total.toLocaleString()}`;
    if (cartBadge) {
        cartBadge.textContent = cartData.items.length;
        cartBadge.style.display = 'inline-block';
    }
} 

function displayEmptyCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');
    const cartBadge = document.getElementById('cartBadge');

    if (!cartItemsContainer || !cartTotalElement) return;

    cartItemsContainer.innerHTML = `
        <div class="empty-cart">
            <i class="fas fa-shopping-cart"></i>
            <p>Your cart is empty</p>
            <p>Add some delicious items to get started!</p>
        </div>
    `;
    cartTotalElement.textContent = '₹0';
    if (cartBadge) { cartBadge.style.display = 'none'; cartBadge.textContent = '0'; }
} 

function showCartPaymentSection() {
    const paymentSection = document.getElementById('cartPaymentSection');
    if (paymentSection) {
        paymentSection.style.display = 'block';

        // Show UPI instructions inline if available when user selects UPI
        const upiInstructionsAreaId = 'upiInstructions';
        let upiEl = document.getElementById(upiInstructionsAreaId);
        if (!upiEl) {
            upiEl = document.createElement('div');
            upiEl.id = upiInstructionsAreaId;
            upiEl.style.marginTop = '0.8rem';
            upiEl.style.display = 'none';
            paymentSection.appendChild(upiEl);
        }

        // Fetch UPI config
        fetch(`${API_BASE_URL}/cart/upi`)
            .then(r => r.json())
            .then(data => {
                if (data.success && data.data) {
                    const cfg = data.data;
                    upiEl.innerHTML = `
                        <div style="display:flex;gap:1rem;align-items:center;flex-wrap:wrap;">
                            <div style="min-width:110px;">
                                ${cfg.qrUrl ? `<img src="${cfg.qrUrl}" alt="UPI QR" style="max-width:120px;border-radius:6px;border:1px solid rgba(255,255,255,0.04);">` : `<div style="width:120px;height:120px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.02);border-radius:6px;color:#c9a961;font-size:0.9rem;">QR not configured</div>`}
                            </div>
                            <div style="flex:1;min-width:120px;">
                                <div><strong>UPI ID:</strong> <span id="cartUpiIdText">${cfg.upiNumber || 'Not configured'}</span></div>
                                <div style="font-size:0.9rem;color:#b0b0c0;margin-top:0.4rem;">Select <em>UPI</em> as your payment method above to see these instructions during checkout.</div>
                            </div>
                        </div>
                    `;
                } else {
                    upiEl.innerHTML = '';
                }
            }).catch(err => {
                console.error('Error fetching UPI config', err);
            });

        // Toggle visibility based on selected payment radio
        const radios = document.querySelectorAll('input[name="cartPaymentMethod"]');
        radios.forEach(r => {
            r.addEventListener('change', () => {
                const selected = document.querySelector('input[name="cartPaymentMethod"]:checked');
                if (selected && selected.value === 'upi') {
                    upiEl.style.display = 'block';
                } else {
                    upiEl.style.display = 'none';
                }
            });
        });
    }
}

function hideCartPaymentSection() {
    const paymentSection = document.getElementById('cartPaymentSection');
    if (paymentSection) {
        paymentSection.style.display = 'none';
    }
}

async function updateCartItemQuantity(dishId, newQuantity) {
    dishId = parseInt(dishId);
    newQuantity = parseInt(newQuantity);

    if (isNaN(dishId)) {
        showNotification('❌ Invalid item identifier', 'error');
        return;
    }

    if (newQuantity <= 0) {
        removeCartItem(dishId);
        return;
    }

    // Optimistic UI update
    const itemEl = document.querySelector(`.cart-item[data-dish-id="${dishId}"]`);
    if (!itemEl) {
        // If item not present in DOM, fallback to API
        try {
            await fetch(`${API_BASE_URL}/cart/update`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dishId, quantity: newQuantity })
            });
            await loadCartItems();
            updateCartCount();
            showNotification('✅ Cart updated successfully!', 'success');
        } catch (err) {
            console.error(err);
            showNotification('❌ Error updating cart', 'error');
        }
        return;
    }

    const qtyInput = itemEl.querySelector('.quantity-input');
    const priceEl = itemEl.querySelector('.cart-item-price');
    const subtotalEl = itemEl.querySelector('.cart-item-total');

    const oldQty = parseInt(qtyInput.value || '0', 10);
    const priceValue = parseCurrencyToNumber(priceEl.textContent);

    // Set processing state & optimistic values
    setItemProcessing(dishId, true);
    qtyInput.value = newQuantity;
    subtotalEl.textContent = `₹${(priceValue * newQuantity).toLocaleString()}`;
    recalcAndUpdateTotals();

    try {
        const response = await fetch(`${API_BASE_URL}/cart/update`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dishId, quantity: newQuantity })
        });
        const data = await response.json();
        if (data.success) {
            // Reconcile with server if needed
            displayCartItems(data.data);
            updateCartCount();
            showNotification('✅ Cart updated successfully!', 'success');
        } else {
            // Rollback
            qtyInput.value = oldQty;
            subtotalEl.textContent = `₹${(priceValue * oldQty).toLocaleString()}`;
            recalcAndUpdateTotals();
            showNotification('❌ Error updating cart: ' + data.message, 'error');
        }
    } catch (error) {
        console.error('API error updating cart item; falling back to localStorage and keeping optimistic change:', error);
        // Fallback to localStorage: update demoCart to reflect optimistic change
        try {
            const cart = JSON.parse(localStorage.getItem('demoCart') || '{"items": [], "total": 0}');
            const item = cart.items.find(i => i.dishId === dishId);
            if (item) {
                item.quantity = newQuantity;
                item.subtotal = item.price * item.quantity;
            } else {
                // If not found, push new item
                cart.items.push({ dishId, dishName: itemEl.querySelector('h4').textContent, price: priceValue, quantity: newQuantity, image: itemEl.querySelector('img').src, subtotal: priceValue * newQuantity });
            }
            cart.total = cart.items.reduce((s, it) => s + it.subtotal, 0);
            localStorage.setItem('demoCart', JSON.stringify(cart));
            showNotification('✅ Cart updated (offline demo mode)', 'success');
            // Keep optimistic values shown
            recalcAndUpdateTotals();
            updateCartCount();
        } catch (e) {
            console.error('Fallback localStorage update failed:', e);
            // Rollback if even fallback failed
            qtyInput.value = oldQty;
            subtotalEl.textContent = `₹${(priceValue * oldQty).toLocaleString()}`;
            recalcAndUpdateTotals();
            showNotification('❌ Error updating cart', 'error');
        }
    } finally {
        setItemProcessing(dishId, false);
    }
}

async function removeCartItem(dishId) {
    dishId = parseInt(dishId);
    if (isNaN(dishId)) {
        showNotification('❌ Invalid item identifier', 'error');
        return;
    }

    const itemEl = document.querySelector(`.cart-item[data-dish-id="${dishId}"]`);
    if (!itemEl) {
        // If not in DOM, fallback to API
        try {
            const response = await fetch(`${API_BASE_URL}/cart/remove/${dishId}`, { method: 'DELETE' });
            const data = await response.json();
            if (data.success) {
                await loadCartItems();
                updateCartCount();
                showNotification('✅ Item removed from cart!', 'success');
            } else {
                showNotification('❌ Error removing item: ' + data.message, 'error');
            }
        } catch (err) {
            console.error(err);
            showNotification('❌ Error removing item', 'error');
        }
        return;
    }

    // Optimistic removal: remove from DOM immediately and recalc
    const backupHTML = itemEl.outerHTML;
    itemEl.remove();
    recalcAndUpdateTotals();
    showNotification('Removing item...', 'info');

    try {
        const response = await fetch(`${API_BASE_URL}/cart/remove/${dishId}`, { method: 'DELETE' });
        const data = await response.json();
        if (data.success) {
            updateCartCount();
            showNotification('✅ Item removed from cart!', 'success');
            // If no items left
            if (document.querySelectorAll('.cart-item').length === 0) { displayEmptyCart(); hideCartPaymentSection(); }
        } else {
            // rollback
            const container = document.getElementById('cartItems');
            container.insertAdjacentHTML('afterbegin', backupHTML);
            recalcAndUpdateTotals();
            showNotification('❌ Error removing item: ' + data.message, 'error');
        }
    } catch (error) {
        console.error('API error removing cart item; falling back to localStorage:', error);
        // Fallback remove in localStorage
        const cart = JSON.parse(localStorage.getItem('demoCart') || '{"items": [], "total": 0}');
        const initialLength = cart.items.length;
        cart.items = cart.items.filter(i => i.dishId !== dishId);
        if (cart.items.length < initialLength) {
            cart.total = cart.items.reduce((s, it) => s + it.subtotal, 0);
            localStorage.setItem('demoCart', JSON.stringify(cart));
            showNotification('✅ Item removed from cart (offline demo mode)', 'success');
            if (cart.items.length === 0) { displayEmptyCart(); hideCartPaymentSection(); }
        } else {
            // rollback DOM
            const container = document.getElementById('cartItems');
            container.insertAdjacentHTML('afterbegin', backupHTML);
            recalcAndUpdateTotals();
            showNotification('❌ Item not found in demo cart', 'error');
        }
    }
}

async function clearCart() {
    if (!confirm('Are you sure you want to clear your entire cart?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/cart/clear`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (data.success) {
            await loadCartItems();
            updateCartCount();
            showNotification('✅ Cart cleared successfully!', 'success');
        } else {
            showNotification('❌ Error clearing cart', 'error');
        }
    } catch (error) {
        console.error('Error clearing cart:', error);
        // Fallback: clear local storage
        localStorage.removeItem('demoCart');
        loadCartFromLocalStorage();
        updateCartCount();
        showNotification('✅ Cart cleared successfully!', 'success');
    }
}

async function placeOrderFromCart() {
    const paymentMethod = document.querySelector('input[name="cartPaymentMethod"]:checked');
    if (!paymentMethod) {
        showNotification('❌ Please select a payment method', 'error');
        return;
    }

    // Get customer details from cart form
    const customerName = document.getElementById('cartCustomerName').value.trim();
    const customerEmail = document.getElementById('cartCustomerEmail') ? document.getElementById('cartCustomerEmail').value.trim() : '';
    const customerPhone = document.getElementById('cartCustomerPhone').value.trim();
    const customerAddress = document.getElementById('cartCustomerAddress').value.trim();

    if (!customerName || !customerEmail || !customerPhone || !customerAddress) {
        showNotification('❌ Please fill in all customer details', 'error');
        return;
    }

    if (!isValidPhone(customerPhone)) {
        showNotification('❌ Please enter a valid phone number', 'error');
        return;
    }

    if (!validateEmail(customerEmail)) {
        showNotification('❌ Please enter a valid email address', 'error');
        return;
    }

    const submitButton = document.querySelector('.cart-footer .btn-primary');
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    }

    try {
        const response = await fetch(`${API_BASE_URL}/cart/checkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                customerName: customerName,
                customerEmail: customerEmail,
                customerPhone: customerPhone,
                customerAddress: customerAddress,
                paymentMethod: paymentMethod.value
            })
        });

        const data = await response.json();

        if (data.success) {
            const order = data.data;
            showNotification(`🎉 Order placed successfully! Order ID: ${order.orderId}`, 'success');

            // If payment is UPI and pending, show UPI payment modal to accept txn id
            if (order.payment && order.payment.method === 'upi' && order.payment.status === 'pending') {
                setTimeout(() => showUPIPaymentModal(order), 600);
            } else {
                // Show detailed order confirmation for non-UPI flows
                setTimeout(() => {
                    alert(`✓ Order Confirmed!\n\nOrder ID: ${order.orderId}\nTotal: ₹${order.pricing.total.toLocaleString()}\nPayment: ${order.payment.method.toUpperCase()}\nEstimated Delivery: ${new Date(order.estimatedDelivery).toLocaleString()}\n\nYou will receive a confirmation email shortly.`);
                    closeCartModal();
                    updateCartCount();

                    // Reset form
                    document.getElementById('cartCustomerName').value = '';
                    if (document.getElementById('cartCustomerEmail')) document.getElementById('cartCustomerEmail').value = '';
                    document.getElementById('cartCustomerPhone').value = '';
                    document.getElementById('cartCustomerAddress').value = '';
                }, 1000);
            }
        } else {
            showNotification('❌ Error placing order: ' + data.message, 'error');
        }
    } catch (error) {
        console.error('Error placing order from cart:', error);
        showNotification('❌ Error placing order. Please try again.', 'error');
    } finally {
        // Reset button state
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Place Order';
        }
    }
}

// ========== LUXURY 3D RESTAURANT MAP (ENHANCED) ===========
function initRestaurant3DMap() {
    if (!window.THREE || !document.getElementById('restaurant3DMap')) return;
    const container = document.getElementById('restaurant3DMap');
    container.innerHTML = '';
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x181824);
    const camera = new THREE.PerspectiveCamera(45, width/height, 1, 1000);
    camera.position.set(0, 120, 260);
    // Renderer
    const renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);
    // Controls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 80;
    controls.maxDistance = 400;
    controls.maxPolarAngle = Math.PI/2.1;
    // Floor
    const floorGeo = new THREE.PlaneGeometry(340, 220);
    const floorMat = new THREE.MeshPhongMaterial({color:0x23243a, shininess:18});
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI/2;
    floor.position.y = 0;
    scene.add(floor);
    // Walls
    const wallMat = new THREE.MeshPhongMaterial({color:0x2d2d44, shininess:10});
    const wallGeo = new THREE.BoxGeometry(340, 60, 4);
    const wall1 = new THREE.Mesh(wallGeo, wallMat); wall1.position.set(0,30,-110); scene.add(wall1);
    const wall2 = new THREE.Mesh(wallGeo, wallMat); wall2.position.set(0,30,110); scene.add(wall2);
    const wallSideGeo = new THREE.BoxGeometry(4, 60, 220);
    const wall3 = new THREE.Mesh(wallSideGeo, wallMat); wall3.position.set(-170,30,0); scene.add(wall3);
    const wall4 = new THREE.Mesh(wallSideGeo, wallMat); wall4.position.set(170,30,0); scene.add(wall4);
    // Bar
    const barGeo = new THREE.BoxGeometry(60, 16, 30);
    const barMat = new THREE.MeshPhongMaterial({color:0xd4af37, shininess:60});
    const bar = new THREE.Mesh(barGeo, barMat);
    bar.position.set(120,8,-80);
    scene.add(bar);
    // Bar stools
    for(let i=0;i<4;i++){
        const stoolGeo = new THREE.CylinderGeometry(4,4,12,16);
        const stoolMat = new THREE.MeshPhongMaterial({color:0xc9a961});
        const stool = new THREE.Mesh(stoolGeo, stoolMat);
        stool.position.set(100+12*i,6,-65);
        scene.add(stool);
    }
    // Kitchen
    const kitchenGeo = new THREE.BoxGeometry(60, 24, 40);
    const kitchenMat = new THREE.MeshPhongMaterial({color:0x444466});
    const kitchen = new THREE.Mesh(kitchenGeo, kitchenMat);
    kitchen.position.set(-120,12,90);
    scene.add(kitchen);
    // Windows
    for(let i=0;i<3;i++){
        const winGeo = new THREE.BoxGeometry(30, 18, 2);
        const winMat = new THREE.MeshPhongMaterial({color:0x8ecae6, transparent:true, opacity:0.5});
        const win = new THREE.Mesh(winGeo, winMat);
        win.position.set(-60+60*i,32,-110);
        scene.add(win);
    }
    // Plants
    for(let i=0;i<3;i++){
        const potGeo = new THREE.CylinderGeometry(3,4,6,12);
        const potMat = new THREE.MeshPhongMaterial({color:0x8d5524});
        const pot = new THREE.Mesh(potGeo, potMat);
        pot.position.set(-150+60*i,3,-90);
        scene.add(pot);
        const plantGeo = new THREE.ConeGeometry(5,12,12);
        const plantMat = new THREE.MeshPhongMaterial({color:0x228b22});
        const plant = new THREE.Mesh(plantGeo, plantMat);
        plant.position.set(-150+60*i,12,-90);
        scene.add(plant);
    }
    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xffffff, 0.7);
    dir.position.set(100,200,100);
    scene.add(dir);
    // Luxury Tables (30, 6x5 grid, spaced)
    const tables = [];
    let selectedTable = null;
    // Expose sync for 2D->3D
    window._restaurant3DMapSync = function(tableId, from3D) {
        // Prevent loop
        window._restaurant3DMapSync._from3D = !!from3D;
        // Deselect previous
        if(selectedTable) selectedTable.material.color.set(0xd4af37);
        // Find by id
        const tObj = tables.find(t => t.userData.id === (typeof tableId === 'string' ? parseInt(tableId.replace(/\D/g,'')) : tableId));
        if(tObj) {
            selectedTable = tObj;
            selectedTable.material.color.set(0x00ffb0);
        } else {
            selectedTable = null;
        }
        setTimeout(()=>{window._restaurant3DMapSync._from3D = false;}, 10);
    };
    for(let row=0;row<5;row++){
        for(let col=0;col<6;col++){
            const tid = row*6+col+1;
            const x = -110+col*44;
            const z = -60+row*32;
            const tableGeo = new THREE.CylinderGeometry(11,11,8,32);
            const tableMat = new THREE.MeshPhongMaterial({color:0xd4af37, shininess:60});
            const table = new THREE.Mesh(tableGeo, tableMat);
            table.position.set(x,4,z);
            table.userData = { id: tid, selected: false };
            // Table base
            const baseGeo = new THREE.CylinderGeometry(5,5,3,16);
            const baseMat = new THREE.MeshPhongMaterial({color:0x888888});
            const base = new THREE.Mesh(baseGeo, baseMat);
            base.position.set(x,1.5,z);
            scene.add(base);
            // Label
            const labelDiv = document.createElement('div');
            labelDiv.className = 'table3d-label';
            labelDiv.textContent = tid;
            labelDiv.style.position = 'absolute';
            labelDiv.style.pointerEvents = 'none';
            labelDiv.style.color = '#fff';
            labelDiv.style.fontWeight = 'bold';
            labelDiv.style.fontSize = '13px';
            labelDiv.style.textAlign = 'center';
            labelDiv.style.width = '24px';
            labelDiv.style.transform = 'translate(-50%,-50%)';
            container.appendChild(labelDiv);
            table.userData.labelDiv = labelDiv;
            scene.add(table);
            tables.push(table);
        }
    }
    // Chandeliers
    for(let i=0;i<2;i++){
        const chGeo = new THREE.SphereGeometry(10,18,18);
        const chMat = new THREE.MeshPhongMaterial({color:0xfff3b0, emissive:0xd4af37, emissiveIntensity:0.7});
        const ch = new THREE.Mesh(chGeo, chMat);
        ch.position.set(-60+120*i,54,0);
        scene.add(ch);
    }
    // Raycaster for selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    renderer.domElement.addEventListener('click', function(e){
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((e.clientX-rect.left)/rect.width)*2-1;
        mouse.y = -((e.clientY-rect.top)/rect.height)*2+1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(tables);
        if(intersects.length>0){
            const tid = intersects[0].object.userData.id;
            window.syncTableSelection(tid, true);
        }
    });
    // Animate
    function animate(){
        controls.update();
        renderer.render(scene, camera);
        // Update labels
        tables.forEach(table=>{
            const vector = table.position.clone();
            vector.project(camera);
            const sx = (vector.x*0.5+0.5)*width;
            const sy = (-vector.y*0.5+0.5)*height;
            table.userData.labelDiv.style.left = `${sx}px`;
            table.userData.labelDiv.style.top = `${sy-10}px`;
            table.userData.labelDiv.style.display = (table.position.y>0)?'block':'none';
            table.userData.labelDiv.style.background = table===selectedTable?'#00ffb0':'#d4af37';
            table.userData.labelDiv.style.borderRadius = '6px';
            table.userData.labelDiv.style.padding = '0 4px';
            table.userData.labelDiv.style.boxShadow = table===selectedTable?'0 0 12px #00ffb0':'0 0 6px #d4af37';
        });
        requestAnimationFrame(animate);
    }
    animate();
}
// Auto-init 3D map on DOMContentLoaded
if(document.readyState!=='loading')initRestaurant3DMap();
else document.addEventListener('DOMContentLoaded',initRestaurant3DMap);
// ========== END LUXURY 3D RESTAURANT MAP ===========


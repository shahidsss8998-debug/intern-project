// ================================================
// RESERVATION MODEL
// ================================================
// Defines the structure and validation for table reservations

/**
 * Reservation Model
 * Represents a table reservation at the restaurant
 */
class Reservation {
    constructor(name, email, phone, guests, date, time, occasion, special_requests) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.guests = guests;
        this.date = date; // Format: YYYY-MM-DD
        this.time = time; // Format: HH:MM
        this.occasion = occasion;
        this.special_requests = special_requests;
    }

    /**
     * Validate reservation data
     * @returns {object} Validation result with isValid boolean and errors array
     */
    validate() {
        const errors = [];

        // Validate name
        if (!this.name || this.name.trim() === '') {
            errors.push('Name is required');
        }

        if (this.name && this.name.length < 2) {
            errors.push('Name must be at least 2 characters');
        }

        if (this.name && this.name.length > 100) {
            errors.push('Name cannot exceed 100 characters');
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!this.email || !emailRegex.test(this.email)) {
            errors.push('Valid email address is required');
        }

        // Validate phone
        const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
        if (!this.phone || !phoneRegex.test(this.phone.replace(/\s/g, ''))) {
            errors.push('Valid phone number is required (at least 10 digits)');
        }

        // Validate number of guests
        const guestCount = parseInt(this.guests);
        if (!guestCount || guestCount < 1 || guestCount > 20) {
            errors.push('Number of guests must be between 1 and 20');
        }

        // Validate date
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!this.date || !dateRegex.test(this.date)) {
            errors.push('Valid date is required (YYYY-MM-DD format)');
        }

        // Check if date is in the future
        if (this.date) {
            const reservationDate = new Date(this.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (reservationDate < today) {
                errors.push('Reservation date must be in the future');
            }
        }

        // Validate time
        const timeRegex = /^\d{2}:\d{2}$/;
        if (!this.time || !timeRegex.test(this.time)) {
            errors.push('Valid time is required (HH:MM format)');
        }

        // Check restaurant hours (11:00 - 22:00)
        if (this.time) {
            const [hours, minutes] = this.time.split(':').map(Number);
            if (hours < 11 || hours >= 22) {
                errors.push('Reservation time must be between 11:00 and 22:00');
            }
        }

        // Validate occasion (optional, but if provided should be valid)
        const validOccasions = ['birthday', 'anniversary', 'business', 'wedding', 'other', 'none', ''];
        if (this.occasion && !validOccasions.includes(this.occasion)) {
            errors.push('Invalid occasion selected');
        }

        // Validate special requests
        if (this.special_requests && this.special_requests.length > 500) {
            errors.push('Special requests cannot exceed 500 characters');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Get reservation date and time as formatted string
     * @returns {string} Formatted date and time
     */
    getDateTime() {
        const dateObj = new Date(this.date);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = dateObj.toLocaleDateString('en-US', options);
        return `${formattedDate} at ${this.time}`;
    }

    /**
     * Convert reservation to JSON
     * @returns {object} JSON representation of reservation
     */
    toJSON() {
        return {
            name: this.name,
            email: this.email,
            phone: this.phone,
            guests: parseInt(this.guests),
            date: this.date,
            time: this.time,
            occasion: this.occasion,
            special_requests: this.special_requests
        };
    }
}

module.exports = Reservation;

/**
 * User Management Module
 * Defines predefined users and handles authentication validation
 */

// Predefined users for the system
const VALID_USERS = [
    { 
        id: 'teacher1', 
        name: 'Dulan Chathuranga', 
        email: 'teacher@email.com', 
        password: 'teacher123', 
        role: 'teacher' 
    },
    { 
        id: 'student1', 
        name: 'Lithira Perera', 
        email: 'student1@email.com', 
        password: 'pass123', 
        role: 'student' 
    },
    { 
        id: 'student2', 
        name: 'Nadula Senarathne', 
        email: 'student2@email.com', 
        password: 'pass123', 
        role: 'student' 
    },
    { 
        id: 'student3', 
        name: 'Sanuka Fernando', 
        email: 'student3@email.com', 
        password: 'pass123', 
        role: 'student' 
    }
];

/**
 * Validates user credentials against predefined users
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Object|null} User object if valid, null if invalid
 */
export function validateUser(email, password) {
    if (!email || !password) {
        return null;
    }

    const user = VALID_USERS.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (user) {
        // Return user without password for security
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    return null;
}

/**
 * Gets all valid users (without passwords)
 * @returns {Array} Array of user objects without passwords
 */
export function getAllUsers() {
    return VALID_USERS.map(({ password, ...user }) => user);
}

/**
 * Gets a user by ID
 * @param {string} userId - User ID to find
 * @returns {Object|null} User object without password, or null if not found
 */
export function getUserById(userId) {
    const user = VALID_USERS.find(u => u.id === userId);
    if (user) {
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    return null;
}

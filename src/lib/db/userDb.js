import bcrypt from 'bcryptjs';
import db from './index.js';

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

/**
 * Verify password against hash
 */
export async function verifyPassword(password, hash) {
    return bcrypt.compare(password, hash);
}

/**
 * Create a new user
 */
export async function createUser({ id, name, email, password, role }) {
    const passwordHash = await hashPassword(password);
    
    const stmt = db.prepare(`
        INSERT INTO users (id, name, email, password_hash, role)
        VALUES (?, ?, ?, ?, ?)
    `);
    
    try {
        stmt.run(id, name, email, passwordHash, role);
        return { id, name, email, role };
    } catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
            throw new Error('Email already exists');
        }
        throw error;
    }
}

/**
 * Find user by email
 */
export function findUserByEmail(email) {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
}

/**
 * Find user by ID
 */
export function findUserById(id) {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id);
}

/**
 * Get all users
 */
export function getAllUsers() {
    const stmt = db.prepare('SELECT id, name, email, role, created_at FROM users');
    return stmt.all();
}

/**
 * Validate user credentials
 */
export async function validateUserCredentials(email, password) {
    const user = findUserByEmail(email);
    
    if (!user) {
        return null;
    }
    
    const isValid = await verifyPassword(password, user.password_hash);
    
    if (!isValid) {
        return null;
    }
    
    // Return user without password hash
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

/**
 * Delete user by ID
 */
export function deleteUser(id) {
    const stmt = db.prepare('DELETE FROM users WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
}

/**
 * Update user
 */
export async function updateUser(id, updates) {
    const allowedFields = ['name', 'email', 'role'];
    const fields = Object.keys(updates).filter(key => allowedFields.includes(key));
    
    if (fields.length === 0) {
        throw new Error('No valid fields to update');
    }
    
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => updates[field]);
    
    const stmt = db.prepare(`
        UPDATE users 
        SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
    `);
    
    const result = stmt.run(...values, id);
    return result.changes > 0;
}

/**
 * Update user password
 */
export async function updateUserPassword(id, newPassword) {
    const passwordHash = await hashPassword(newPassword);
    const stmt = db.prepare(`
        UPDATE users 
        SET password_hash = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
    `);
    const result = stmt.run(passwordHash, id);
    return result.changes > 0;
}

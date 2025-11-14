import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(process.cwd(), 'data', 'users.db');
const schemaPath = path.join(process.cwd(), 'src', 'lib', 'db', 'schema.sql');

// Ensure data directory exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Create database connection
const db = new Database(dbPath);

// Enable WAL mode for better concurrent access
db.pragma('journal_mode = WAL');

/**
 * Initialize database schema
 */
export function initializeDatabase() {
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    db.exec(schema);
    console.log('✓ Database schema initialized');
}

/**
 * Get database instance
 */
export function getDatabase() {
    return db;
}

/**
 * Close database connection
 */
export function closeDatabase() {
    db.close();
}

// Initialize on import
initializeDatabase();

export default db;

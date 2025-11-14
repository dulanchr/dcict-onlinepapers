import { createUser } from '../src/lib/db/userDb.js';
import { closeDatabase } from '../src/lib/db/index.js';

function parseArgs() {
    const args = process.argv.slice(2);
    const parsed = {};
    
    args.forEach(arg => {
        const match = arg.match(/--(\w+)=(.+)/);
        if (match) {
            parsed[match[1]] = match[2];
        }
    });
    
    return parsed;
}

function generateUserId(role) {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `${role}${timestamp}${random}`;
}

function validateInput({ name, email, password, role }) {
    const errors = [];
    
    if (!name || name.trim().length === 0) {
        errors.push('Name is required');
    }
    
    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        errors.push('Valid email is required');
    }
    
    if (!password || password.length < 6) {
        errors.push('Password must be at least 6 characters');
    }
    
    if (!role || !['student', 'teacher'].includes(role)) {
        errors.push('Role must be either "student" or "teacher"');
    }
    
    return errors;
}

async function seedUser() {
    console.log('🌱 Creating new user...\n');
    
    const args = parseArgs();
    const { name, email, password, role } = args;
    
    // Validate input
    const errors = validateInput({ name, email, password, role });
    if (errors.length > 0) {
        console.error('❌ Validation errors:');
        errors.forEach(error => console.error(`   - ${error}`));
        console.log('\n💡 Usage:');
        console.log('   npm run seed:user -- --name="John Doe" --email=john@email.com --password=pass123 --role=student');
        closeDatabase();
        process.exit(1);
    }
    
    try {
        const id = generateUserId(role);
        const user = await createUser({ id, name, email, password, role });
        
        console.log('✓ User created successfully!\n');
        console.log('📋 User Details:');
        console.log(`   ID: ${user.id}`);
        console.log(`   Name: ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`\n🔐 Credentials for login:`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Password: ${password}`);
        
    } catch (error) {
        console.error('❌ Failed to create user:', error.message);
        closeDatabase();
        process.exit(1);
    }
    
    closeDatabase();
    console.log('\n✓ Operation completed');
}

seedUser().catch(error => {
    console.error('❌ Seed failed:', error);
    closeDatabase();
    process.exit(1);
});

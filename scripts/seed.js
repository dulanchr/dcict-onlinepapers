import { createUser, getAllUsers } from '../src/lib/db/userDb.js';
import { closeDatabase } from '../src/lib/db/index.js';

const SEED_USERS = [
    // Teachers
    { 
        id: 'teacher1', 
        name: 'Dulan Chathuranga', 
        email: 'teacher@email.com', 
        password: 'teacher123', 
        role: 'teacher' 
    },
    
    // Students - Original
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
    },
];

async function seed() {
    console.log('🌱 Starting database seed...\n');
    
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;
    
    for (const userData of SEED_USERS) {
        try {
            await createUser(userData);
            console.log(`✓ Created user: ${userData.name} (${userData.email})`);
            successCount++;
        } catch (error) {
            if (error.message.includes('Email already exists')) {
                console.log(`⊘ Skipped user: ${userData.name} (${userData.email}) - already exists`);
                skipCount++;
            } else {
                console.error(`✗ Error creating user ${userData.name}:`, error.message);
                errorCount++;
            }
        }
    }
    
    console.log('\n📊 Seed Summary:');
    console.log(`   ✓ Created: ${successCount}`);
    console.log(`   ⊘ Skipped: ${skipCount}`);
    console.log(`   ✗ Errors: ${errorCount}`);
    
    // Show all users
    console.log('\n👥 All Users in Database:');
    const allUsers = getAllUsers();
    allUsers.forEach(user => {
        console.log(`   - ${user.name} (${user.email}) - ${user.role}`);
    });
    
    closeDatabase();
    console.log('\n✓ Database seed completed');
}

seed().catch(error => {
    console.error('❌ Seed failed:', error);
    closeDatabase();
    process.exit(1);
});

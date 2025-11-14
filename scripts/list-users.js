import { getAllUsers } from '../src/lib/db/userDb.js';
import { closeDatabase } from '../src/lib/db/index.js';

async function listUsers() {
    console.log('📋 Users in Database:\n');
    
    try {
        const users = getAllUsers();
        
        if (users.length === 0) {
            console.log('   No users found in database');
            console.log('\n💡 Run "npm run seed" to add sample users');
        } else {
            // Group by role
            const teachers = users.filter(u => u.role === 'teacher');
            const students = users.filter(u => u.role === 'student');
            
            if (teachers.length > 0) {
                console.log('👨‍🏫 Teachers:');
                teachers.forEach((user, index) => {
                    console.log(`   ${index + 1}. ${user.name} (${user.email})`);
                    console.log(`      ID: ${user.id} | Created: ${new Date(user.created_at).toLocaleString()}`);
                });
                console.log('');
            }
            
            if (students.length > 0) {
                console.log('👨‍🎓 Students:');
                students.forEach((user, index) => {
                    console.log(`   ${index + 1}. ${user.name} (${user.email})`);
                    console.log(`      ID: ${user.id} | Created: ${new Date(user.created_at).toLocaleString()}`);
                });
                console.log('');
            }
            
            console.log(`📊 Total: ${users.length} users (${teachers.length} teachers, ${students.length} students)`);
        }
    } catch (error) {
        console.error('❌ Error listing users:', error.message);
    } finally {
        closeDatabase();
    }
}

listUsers();

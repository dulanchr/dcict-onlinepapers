import { NextResponse } from 'next/server';
import { isTeacher } from '../../../../lib/session';
import { getAllUsers } from '../../../../lib/db/userDb';

export async function GET() {
    try {
        // Middleware already checks authentication, but double-check role
        if (!await isTeacher()) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Get all students (teachers can see student list)
        const users = getAllUsers();
        const students = users.filter(u => u.role === 'student');

        return NextResponse.json({ students });
    } catch (error) {
        console.error('Students list error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

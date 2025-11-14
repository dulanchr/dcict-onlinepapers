import { NextResponse } from 'next/server';
import { validateUserCredentials } from '../../../../lib/db/userDb.js';
import { getSession } from '../../../../lib/session.js';

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        const user = await validateUserCredentials(email, password);

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        const session = await getSession();
        session.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        };
        await session.save();

        return NextResponse.json({ 
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

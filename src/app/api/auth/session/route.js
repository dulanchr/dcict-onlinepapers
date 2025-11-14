import { NextResponse } from 'next/server';
import { getSession } from '../../../../lib/session.js';

export async function GET() {
    try {
        const session = await getSession();
        
        if (!session.user) {
            return NextResponse.json({ user: null });
        }

        return NextResponse.json({ 
            user: {
                id: session.user.id,
                name: session.user.name,
                email: session.user.email,
                role: session.user.role
            }
        });
    } catch (error) {
        console.error('Session check error:', error);
        return NextResponse.json({ user: null }, { status: 200 });
    }
}
